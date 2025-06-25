import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';

/**
 * Interface for error details in JSON operations
 */
export interface ErrorDetails {
  message: string;
  lineNumber?: number;
  columnNumber?: number;
  position?: number;
  path?: string[];
  status?: number;
  url?: string;
}

/**
 * Result interface for JSON formatting operations
 */
export interface JsonFormatResult {
  success: boolean;
  result?: string;
  error?: string;
  errorDetails?: ErrorDetails;
}

/**
 * Interface for JSON validation result
 */
interface JsonValidationResult {
  isValid: boolean;
  error?: ErrorDetails;
  data?: any;
}

/**
 * Interface for file validation result
 */
interface FileValidationResult {
  isValid: boolean;
  error?: string;
  content?: string;
}

// Maximum file size in bytes (2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024;

// Allowed file types for upload
const ALLOWED_FILE_TYPES = ['application/json', 'text/plain'];

@Injectable({
  providedIn: 'root'
})
export class JsonFormatService {
  constructor(private http: HttpClient) {}

  /**
   * Validates if input is a non-empty string
   */
  private validateStringInput(input: unknown, fieldName: string = 'Input'): string | null {
    if (input === null || input === undefined || input === '') {
      return `${fieldName} cannot be empty`;
    }
    if (typeof input !== 'string') {
      return `${fieldName} must be a string`;
    }
    return null;
  }

  /**
   * Extracts error details from a JSON parsing error
   */
  private extractJsonErrorDetails(error: Error): { lineNumber?: number; columnNumber?: number; position?: number } {
    const result: { lineNumber?: number; columnNumber?: number; position?: number } = {};
    
    if (!error.message) return result;
    
    // Try to extract position from error message
    const positionMatch = error.message.match(/at position (\d+)/);
    if (positionMatch?.[1]) {
      result.position = parseInt(positionMatch[1], 10);
    }
    
    // Try to extract line and column numbers
    const lineColMatch = error.message.match(/at line (\d+) column (\d+)/i);
    if (lineColMatch?.[1] && lineColMatch?.[2]) {
      result.lineNumber = parseInt(lineColMatch[1], 10);
      result.columnNumber = parseInt(lineColMatch[2], 10);
    }
    
    return result;
  }

  /**
   * Validates and parses JSON string with detailed error information
   */
  private parseJson(jsonString: string): JsonValidationResult {
    const validationError = this.validateStringInput(jsonString, 'JSON string');
    if (validationError) {
      return { 
        isValid: false, 
        error: { message: validationError } 
      };
    }

    try {
      const data = JSON.parse(jsonString);
      return { 
        isValid: true, 
        data 
      };
    } catch (error) {
      const errorObj = error as Error;
      const errorDetails = this.extractJsonErrorDetails(errorObj);
      
      let errorMessage = 'Invalid JSON format';
      if (errorObj.message) {
        // Clean up the error message for display
        errorMessage = errorObj.message
          .replace(/^[^:]+:\s*/, '') // Remove the 'SyntaxError: ' prefix
          .replace(/\s*\([^)]+\)$/, ''); // Remove the position suffix
      }
      
      return { 
        isValid: false, 
        error: { 
          message: errorMessage,
          ...errorDetails
        }
      };
    }
  }

  /**
   * Validates a file before processing
   */
  private validateFile(file: File): FileValidationResult {
    if (!file) {
      return { 
        isValid: false, 
        error: 'No file provided' 
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1);
      return { 
        isValid: false, 
        error: `File is too large. Maximum size is ${maxSizeMB}MB` 
      };
    }

    // Check file type
    const fileType = file.type.toLowerCase();
    const isAllowedType = ALLOWED_FILE_TYPES.some(type => 
      fileType.includes(type.replace('application/', '')) || 
      file.name.toLowerCase().endsWith('.json')
    );

    if (!isAllowedType) {
      return { 
        isValid: false, 
        error: 'Invalid file type. Only JSON and text files are allowed.' 
      };
    }

    return { isValid: true };
  }

  /**
   * Formats a JSON string with proper indentation
   * @param jsonString The JSON string to format
   * @param indent Number of spaces for indentation (default: 2)
   * @returns Formatted JSON string or error details
   */
  formatJson(jsonString: string, indent: number = 2): JsonFormatResult {
    const parseResult = this.parseJson(jsonString);
    
    if (!parseResult.isValid) {
      return { 
        success: false, 
        error: parseResult.error?.message || 'Invalid JSON',
        errorDetails: parseResult.error
      };
    }

    try {
      const formattedJson = JSON.stringify(parseResult.data, null, indent);
      return { 
        success: true, 
        result: formattedJson 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error formatting JSON';
      return { 
        success: false, 
        error: errorMessage,
        errorDetails: {
          message: errorMessage
        }
      };
    }
  }

  /**
   * Minifies a JSON string by removing unnecessary whitespace
   * @param jsonString The JSON string to minify
   * @returns Minified JSON string or error details
   */
  minifyJson(jsonString: string): JsonFormatResult {
    const parseResult = this.parseJson(jsonString);
    
    if (!parseResult.isValid) {
      return { 
        success: false, 
        error: parseResult.error?.message || 'Invalid JSON',
        errorDetails: parseResult.error
      };
    }

    try {
      const minifiedJson = JSON.stringify(parseResult.data);
      return { 
        success: true, 
        result: minifiedJson 
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error minifying JSON';
      return { 
        success: false, 
        error: errorMessage,
        errorDetails: {
          message: errorMessage
        }
      };
    }
  }

  /**
   * Validates a JSON string
   * @param jsonString The JSON string to validate
   * @returns Validation result with success status and error message if invalid
   */
  validateJson(jsonString: string): { success: boolean; error?: string; errorDetails?: ErrorDetails } {
    const parseResult = this.parseJson(jsonString);
    return {
      success: parseResult.isValid,
      error: parseResult.error?.message,
      errorDetails: parseResult.error
    };
  }

  /**
   * Reads and parses a JSON file
   * @param file The file to read
   * @returns Observable with parsed JSON content or error details
   */
  /**
   * Reads and parses a JSON file
   * @param file The file to read
   * @returns Observable with parsed JSON content or error details
   */
  readJsonFile(file: File): Observable<JsonFormatResult> {
    return new Observable<JsonFormatResult>(subscriber => {
      // Validate the file first
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        subscriber.next({ 
          success: false, 
          error: validation.error || 'Invalid file',
          errorDetails: {
            message: validation.error || 'Invalid file'
          }
        });
        subscriber.complete();
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const fileContent = event.target?.result as string;
          
          if (!fileContent) {
            throw new Error('File is empty');
          }
          
          const parseResult = this.parseJson(fileContent);
          
          if (!parseResult.isValid) {
            subscriber.next({
              success: false,
              error: parseResult.error?.message || 'Invalid JSON in file',
              errorDetails: parseResult.error
            });
            subscriber.complete();
            return;
          }
          
          // Format the JSON with proper indentation
          const formattedJson = JSON.stringify(parseResult.data, null, 2);
          
          subscriber.next({ 
            success: true, 
            result: formattedJson 
          });
          subscriber.complete();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error processing file';
          subscriber.next({
            success: false,
            error: errorMessage,
            errorDetails: {
              message: errorMessage
            }
          });
          subscriber.complete();
        }
      };

      reader.onerror = () => {
        subscriber.next({ 
          success: false, 
          error: 'Error reading file',
          errorDetails: {
            message: 'Failed to read file content: ' + (reader.error?.message || 'Unknown error')
          }
        });
        subscriber.complete();
      };

      try {
        reader.readAsText(file);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error reading file';
        subscriber.next({
          success: false,
          error: errorMessage,
          errorDetails: {
            message: errorMessage
          }
        });
        subscriber.complete();
      }

      // Return cleanup function
      return () => {
        if (reader.readyState === 1) { // LOADING
          reader.abort();
        }
      };
    });
  }
  /**
   * Fetches JSON from a URL
   * @param urlString The URL to fetch JSON from
   * @returns Observable with JSON data or error message
   */
  fetchJsonFromUrl(urlString: string): Observable<JsonFormatResult> {
    // Validate URL first
    try {
      new URL(urlString);
    } catch (error) {
      return of({
        success: false,
        error: 'Invalid URL',
        errorDetails: {
          message: 'The provided URL is not valid'
        }
      });
    }

    return this.http.get(urlString).pipe(
      map(data => {
        try {
          const jsonString = JSON.stringify(data, null, 2);
          // Validate the JSON string
          const validation = this.validateJson(jsonString);
          if (validation.success) {
            return {
              success: true,
              result: jsonString
            };
          } else {
            throw new Error(validation.error || 'Invalid JSON received from URL');
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error parsing JSON from URL';
          throw new Error(errorMessage);
        }
      }),
      catchError(error => {
        return of({
          success: false,
          error: 'Failed to fetch JSON: ' + (error.message || 'Unknown error')
        });
      })
    );
  }

  /**
   * Copies text to the clipboard
   * @param text The text to copy to clipboard
   * @returns Promise that resolves with success status and optional error message
   */
  copyToClipboard(text: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      if (!text) {
        resolve({
          success: false,
          error: 'No text provided to copy'
        });
        return;
      }

      // Use the modern clipboard API if available
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
          .then(() => resolve({ success: true }))
          .catch(err => resolve({
            success: false,
            error: 'Failed to copy to clipboard: ' + (err.message || 'Unknown error')
          }));
      } else {
        // Fallback for older browsers
        try {
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          document.body.appendChild(textarea);
          textarea.select();
          
          const successful = document.execCommand('copy');
          document.body.removeChild(textarea);
          
          if (successful) {
            resolve({ success: true });
          } else {
            resolve({
              success: false,
              error: 'Copy command was unsuccessful'
            });
          }
        } catch (err) {
          resolve({
            success: false,
            error: 'Failed to copy to clipboard: ' + (err instanceof Error ? err.message : 'Unknown error')
          });
        }
      }
    });
  }

  /**
   * Triggers a file download with the given content
   * @param content The content to download
   * @param filename The name of the file to download
   * @param fileType The MIME type of the file
   * @returns Object indicating success or failure
   */
  downloadFile(content: string, filename: string = 'formatted.json', fileType: string = 'application/json'): { success: boolean; error?: string } {
    try {
      if (!content) {
        return {
          success: false,
          error: 'No content provided for download'
        };
      }

      // Create a Blob with the content
      const blob = new Blob([content], { type: fileType });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename.endsWith('.json') ? filename : `${filename}.json`;
      
      // Append to the document, trigger click, and clean up
      document.body.appendChild(anchor);
      anchor.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      }, 0);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error downloading file';
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}