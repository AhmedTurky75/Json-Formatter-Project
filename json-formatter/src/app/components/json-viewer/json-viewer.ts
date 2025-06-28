import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

type JsonNode = {
  key?: string | number;
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  expanded?: boolean;
  children?: JsonNode[];
  depth?: number;
  isLast?: boolean;
};

@Component({
  selector: 'app-json-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.scss']
})
export class JsonViewerComponent implements OnChanges {
  @Input() json: any;
  @Input() expanded = false;
  
  rootNode: JsonNode | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['json'] || changes['expanded']) {
      if (this.json) {
        try {
          const parsed = typeof this.json === 'string' ? JSON.parse(this.json) : this.json;
          this.rootNode = this.createNode('root', parsed, 0, this.expanded);
        } catch (e) {
          console.error('Invalid JSON', e);
          this.rootNode = null;
        }
      } else {
        this.rootNode = null;
      }
    }
  }

  private createNode(
    key: string | number | 'root',
    value: any,
    depth: number,
    expanded: boolean,
    isLastSibling = true
  ): JsonNode {
    const node: JsonNode = {
      key: key === 'root' ? undefined : key,
      value: undefined,
      type: 'null',
      depth,
      expanded: depth < 2 ? true : expanded,
      isLast: isLastSibling,
      children: []
    };

    if (value === null) {
      node.type = 'null';
      node.value = null;
    } else if (Array.isArray(value)) {
      node.type = 'array';
      node.value = value;
      if (value.length > 0) {
        node.children = value.map((item, index, arr) => {
          const isLast = index === arr.length - 1;
          return this.createNode(index, item, depth + 1, expanded, isLast);
        });
      }
    } else if (typeof value === 'object' && value !== null) {
      node.type = 'object';
      node.value = value;
      const entries = Object.entries(value);
      if (entries.length > 0) {
        node.children = entries.map(([k, v], index, arr) => {
          const isLast = index === arr.length - 1;
          return this.createNode(k, v, depth + 1, expanded, isLast);
        });
      }
    } else {
      node.type = typeof value as 'string' | 'number' | 'boolean';
      node.value = value;
    }

    return node;
  }

  toggleNode(node: JsonNode, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    if (node.type === 'object' || node.type === 'array') {
      node.expanded = !node.expanded;
    }
  }

  isExpandable(node: JsonNode): boolean {
    return (node.type === 'object' || node.type === 'array') && 
           !!node.children && node.children.length > 0;
  }

  getBracket(type: 'object' | 'array', isOpen: boolean): string {
    if (type === 'array') {
      return isOpen ? '[' : ']';
    }
    return isOpen ? '{' : '}';
  }

  trackByFn(index: number, node: JsonNode): string {
    return `${node.key}-${index}`;
  }
}
