# 🔒 PII Anonymizer Application

A modern React.js application that integrates with Microsoft Presidio to anonymize and deanonymize sensitive information in documents and text.

## Features

- **🔍 Intelligent PII Detection**: Automatically detects emails, phone numbers, credit cards, SSNs, names, dates, and IP addresses
- **🛡️ Multiple Anonymization Options**: Replace, mask, redact, hash, or encrypt sensitive data
- **📁 Document Upload**: Support for TXT, CSV, JSON, MD, and RTF files
- **⚙️ Configurable Settings**: Customize anonymization rules for different entity types
- **📊 Detailed Results**: View original text, anonymized text, detected entities, and metadata
- **🔓 Deanonymization**: Reverse the anonymization process when using reversible operators
- **💾 Export Options**: Download anonymized text or copy to clipboard

## Prerequisites

1. **Presidio Anonymizer** running on `localhost:5001`
2. **Node.js** (version 16 or higher)
3. **npm** or **yarn**

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your configuration
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### 1. Input Methods
- **File Upload**: Drag and drop or click to upload documents
- **Text Input**: Type or paste text directly into the text area

### 2. Configuration
Configure anonymization settings for different entity types:
- **Replace**: Replace with custom text (e.g., `[REDACTED]`)
- **Mask**: Mask characters with symbols (e.g., `***-**-1234`)
- **Redact**: Remove the text entirely
- **Hash**: Generate a hash of the original text
- **Encrypt**: Encrypt the text (reversible with deanonymization)

### 3. Anonymization
Click "🔒 Anonymize Text" to process your input through Presidio.

### 4. Results
View results in multiple tabs:
- **Original Text**: Highlighted PII entities
- **Anonymized Text**: Processed output
- **Detected Entities**: List of found PII with confidence scores
- **Metadata**: Complete API response details

### 5. Export
- Copy anonymized text to clipboard
- Download as text file
- Deanonymize (for reversible operations)

## Supported Entity Types

| Entity Type | Description | Example |
|-------------|-------------|---------|
| EMAIL | Email addresses | `user@example.com` |
| PHONE_NUMBER | Phone numbers | `555-123-4567` |
| CREDIT_CARD | Credit card numbers | `4111-1111-1111-1111` |
| US_SSN | Social Security Numbers | `123-45-6789` |
| PERSON | Person names | `John Smith` |
| DATE_TIME | Dates and times | `2024-01-15` |
| IP_ADDRESS | IP addresses | `192.168.1.1` |
| DEFAULT | Fallback for unmatched entities | Any other PII |

## API Integration

The application integrates with Presidio Anonymizer API at `localhost:5001`:

- **POST /anonymize**: Anonymize text with detected entities
- **POST /deanonymize**: Reverse anonymization for encrypted data

### Sample Request
```json
{
  "text": "Hello, my name is John Doe and my email is john@example.com",
  "anonymizers": {
    "PERSON": {
      "type": "replace",
      "new_value": "[PERSON]"
    },
    "EMAIL": {
      "type": "replace",
      "new_value": "--Redacted email--"
    }
  },
  "analyzer_results": [
    {
      "start": 17,
      "end": 25,
      "score": 0.8,
      "entity_type": "PERSON"
    }
  ]
}
```

## Architecture

```
src/
├── components/
│   ├── FileUpload.js          # File upload with drag-and-drop
│   ├── TextInput.js           # Text input with anonymization
│   ├── AnonymizationOptions.js # Configuration panel
│   └── ResultsDisplay.js      # Results viewer with tabs
├── services/
│   └── presidioApi.js         # Presidio API integration
├── App.js                     # Main application component
└── index.js                   # React entry point
```

## Troubleshooting

### Common Issues

1. **"Failed to anonymize text"**
   - Ensure Presidio is running on `localhost:5001`
   - Check browser console for CORS errors
   - Verify Presidio API endpoints are accessible

2. **"No entities detected"**
   - Check if text contains recognizable PII patterns
   - Text detection uses regex patterns for common formats
   - Some entities may require specific formatting

3. **Deanonymization not working**
   - Only works with reversible operators (encrypt)
   - Requires original operator results
   - Check encryption keys match

### Testing Presidio Connection

The application includes a connection test function:
```javascript
import { testPresidioConnection } from './services/presidioApi';

testPresidioConnection().then(isConnected => {
  console.log('Presidio connected:', isConnected);
});
```

## Example Usage

Try this sample text:
```
Hello, my name is John Smith and I work at ACME Corp. 
My email is john.smith@acme.com and my phone number is 555-123-4567.
My credit card number is 4111-1111-1111-1111 and my SSN is 123-45-6789.
I live at 192.168.1.1 and was born on 01/15/1990.
```

Expected anonymized output:
```
Hello, my name is [PERSON] and I work at ACME Corp. 
My email is --Redacted email-- and my phone number is --Redacted phone number--.
My credit card number is ****-****-****-1111 and my SSN is ***-**-6789.
I live at [IP] and was born on [DATE].
```

## Security Notes

- This application processes sensitive data - ensure secure deployment
- Use HTTPS in production environments
- Set secure environment variables in production:
  - `REACT_APP_PRESIDIO_BASE_URL`: Use your production Presidio endpoint
  - `REACT_APP_ENCRYPTION_KEY`: Use a secure random key for encryption
- Consider data retention policies for processed text
- Review Presidio's security recommendations
- Never log or store sensitive information
- The application includes XSS protection and input sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Presidio integration
5. Submit a pull request

## License

This project is licensed under the MIT License. 