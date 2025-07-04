import axios from 'axios';

const PRESIDIO_BASE_URL = process.env.REACT_APP_PRESIDIO_BASE_URL || 'http://localhost:5001';

/**
 * Analyzes text to detect PII entities using pattern matching
 * @param {string} text - The text to analyze
 * @returns {Promise<Array>} Array of detected entities with start, end, score, and entity_type
 */
const analyzeText = async (text) => {
  // This is a mock analyzer that detects common PII patterns
  // In production, you'd call the actual Presidio analyzer
  const entities = [];
  
  // Email detection
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  let match;
  while ((match = emailRegex.exec(text)) !== null) {
    entities.push({
      start: match.index,
      end: match.index + match[0].length,
      score: 0.9,
      entity_type: 'EMAIL'
    });
  }
  
  // Phone number detection (simple pattern)
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  while ((match = phoneRegex.exec(text)) !== null) {
    entities.push({
      start: match.index,
      end: match.index + match[0].length,
      score: 0.85,
      entity_type: 'PHONE_NUMBER'
    });
  }
  
  // Credit card detection (simple pattern)
  const creditCardRegex = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g;
  while ((match = creditCardRegex.exec(text)) !== null) {
    entities.push({
      start: match.index,
      end: match.index + match[0].length,
      score: 0.9,
      entity_type: 'CREDIT_CARD'
    });
  }
  
  // SSN detection (simple pattern)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  while ((match = ssnRegex.exec(text)) !== null) {
    entities.push({
      start: match.index,
      end: match.index + match[0].length,
      score: 0.9,
      entity_type: 'US_SSN'
    });
  }
  
  // Names detection (simple pattern for common names)
  const nameRegex = /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g;
  while ((match = nameRegex.exec(text)) !== null) {
    entities.push({
      start: match.index,
      end: match.index + match[0].length,
      score: 0.7,
      entity_type: 'PERSON'
    });
  }
  
  // IP Address detection
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  while ((match = ipRegex.exec(text)) !== null) {
    entities.push({
      start: match.index,
      end: match.index + match[0].length,
      score: 0.85,
      entity_type: 'IP_ADDRESS'
    });
  }
  
  // Date detection (simple pattern)
  const dateRegex = /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g;
  while ((match = dateRegex.exec(text)) !== null) {
    entities.push({
      start: match.index,
      end: match.index + match[0].length,
      score: 0.8,
      entity_type: 'DATE_TIME'
    });
  }
  
  return entities;
};

/**
 * Anonymizes text using Presidio API
 * @param {string} text - The text to anonymize
 * @param {Object} anonymizers - Configuration for anonymization
 * @returns {Promise<Object>} Object containing original text, anonymized text, entities, and operator results
 */
export const anonymizeText = async (text, anonymizers) => {
  try {
    // First analyze the text to get entities
    const analyzerResults = await analyzeText(text);
    
    // Prepare the request payload for Presidio anonymizer
    const payload = {
      text: text,
      anonymizers: anonymizers,
      analyzer_results: analyzerResults
    };
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Sending to Presidio:', payload);
    }
    
    // Call the Presidio anonymizer API
    const response = await axios.post(`${PRESIDIO_BASE_URL}/anonymize`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return {
      original: text,
      anonymized: response.data.text,
      entities: analyzerResults,
      operator_results: response.data.items || []
    };
    
  } catch (error) {
    console.error('Error calling Presidio API:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw new Error(`Failed to anonymize text: ${error.message}`);
  }
};

/**
 * Deanonymizes text using Presidio API
 * @param {string} text - The anonymized text to deanonymize
 * @param {Array} operatorResults - The operator results from anonymization
 * @returns {Promise<Object>} Object containing deanonymized text and items
 */
export const deanonymizeText = async (text, operatorResults) => {
  try {
    const payload = {
      text: text,
      deanonymizers: {
        'DEFAULT': { type: 'decrypt', key: process.env.REACT_APP_ENCRYPTION_KEY || 'WmZq4t7w!z%C&F)J' }
      },
      anonymizer_results: operatorResults
    };
    
    const response = await axios.post(`${PRESIDIO_BASE_URL}/deanonymize`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return {
      text: response.data.text,
      items: response.data.items || []
    };
    
  } catch (error) {
    console.error('Error calling Presidio deanonymize API:', error);
    throw new Error(`Failed to deanonymize text: ${error.message}`);
  }
};

// Test connection to Presidio
export const testPresidioConnection = async () => {
  try {
    const response = await axios.get(`${PRESIDIO_BASE_URL}/health`, {
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    console.error('Presidio connection test failed:', error);
    return false;
  }
}; 