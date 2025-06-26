import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface JsonNode {
  key?: string;
  value: any;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  expanded?: boolean;
  children?: JsonNode[];
}

@Component({
  selector: 'app-json-tree-view',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './json-tree-view.html',
  styleUrls: ['./json-tree-view.scss']
})
export class JsonTreeView implements OnChanges {
  @Input() json: string | object | null = null;
  parsedJson: JsonNode | null = null;
  error: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['json']) {
      this.parseJson();
      console.log(this.parsedJson );

    }
  }

  private parseJson() {
    if (!this.json) {
      this.parsedJson = null;
      return;
    }

    try {
      const jsonObj = typeof this.json === 'string' ? JSON.parse(this.json) : this.json;
      this.parsedJson = this.createNode('root', jsonObj);
      this.error = null;
    } catch (e) {
      this.error = 'Invalid JSON';
      this.parsedJson = null;
    }
  }

  private createNode(key: string | 'root', value: any): JsonNode {
    const node: JsonNode = { value, type: 'null' };
    
    if (key !== 'root') {
      node.key = key;
    }

    if (value === null) {
      node.type = 'null';
    } else if (Array.isArray(value)) {
      node.type = 'array';
      node.expanded = true;
      node.children = value.map((item, index) => 
        this.createNode(index.toString(), item)
      );
    } else if (typeof value === 'object') {
      node.type = 'object';
      node.expanded = true;
      node.children = Object.entries(value).map(([k, v]) => 
        this.createNode(k, v)
      );
    } else if (typeof value === 'string') {
      node.type = 'string';
    } else if (typeof value === 'number') {
      node.type = 'number';
    } else if (typeof value === 'boolean') {
      node.type = 'boolean';
    }

    return node;
  }

  toggleExpand(node: JsonNode) {
    if (node.type === 'object' || node.type === 'array') {
      node.expanded = !node.expanded;
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'object': return 'folder';
      case 'array': return 'list';
      case 'string': return 'text_fields';
      case 'number': return 'numbers';
      case 'boolean': return 'toggle_on';
      case 'null': return 'block';
      default: return 'help_outline';
    }
  }
}
