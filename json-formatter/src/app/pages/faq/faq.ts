import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './faq.html',
  styleUrls: ['./faq.scss']
})
export class FaqComponent implements OnInit {
  faqItems: FaqItem[] = [
    {
      question: 'What is JSON?',
      answer: 'JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate.'
    },
    {
      question: 'How does this formatter work?',
      answer: 'Our JSON formatter takes your JSON input, parses it, and displays it in a well-formatted, indented structure with syntax highlighting for better readability.'
    },
    {
      question: 'Is my data stored?',
      answer: 'No, all processing happens in your browser. We do not store, log, or transmit your JSON data to any server.'
    },
    {
      question: 'Can I convert JSON to XML or CSV?',
      answer: 'Yes, our formatter supports converting JSON to various formats including XML and CSV. You can find these options in the format selection menu.'
    },
    {
      question: 'Is this tool free to use?',
      answer: 'Yes, our JSON formatter is completely free to use with no limitations.'
    },
    {
      question: 'What JSON standards does this support?',
      answer: 'Our formatter supports the official JSON standard (RFC 8259) including all valid JSON data types: objects, arrays, strings, numbers, booleans, and null.'
    },
    {
      question: 'How do I format minified JSON?',
      answer: 'Simply paste your minified JSON into the input area and click the "Format" button. The formatter will automatically detect and properly indent your JSON.'
    },
    {
      question: 'Can I validate JSON with this tool?',
      answer: 'Yes, the formatter will automatically validate your JSON as you type and highlight any syntax errors.'
    }
  ];
  
  // Track the expanded state of accordion items
  expandedIndex = 0;
  filteredFaqItems: FaqItem[] = [];
  searchQuery = '';

  ngOnInit() {
    this.filteredFaqItems = [...this.faqItems];
  }

  filterFAQs(event: Event) {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery = query;
    
    if (!query) {
      this.filteredFaqItems = [...this.faqItems];
      return;
    }
    
    this.filteredFaqItems = this.faqItems.filter(item => 
      item.question.toLowerCase().includes(query) || 
      item.answer.toLowerCase().includes(query)
    );
  }
}
