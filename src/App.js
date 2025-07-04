import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import FileUpload from './components/FileUpload';
import TextInput from './components/TextInput';
import ResultsDisplay from './components/ResultsDisplay';
import AnonymizationOptions from './components/AnonymizationOptions';
import ErrorBoundary from './components/ErrorBoundary';
import { anonymizeText, deanonymizeText } from './services/presidioApi';
import { showError, showSuccess } from './utils/notifications';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 10px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.2em;
  opacity: 0.9;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
  font-size: 1.5em;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function App() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [anonymizationOptions, setAnonymizationOptions] = useState({
    DEFAULT: { type: 'replace', new_value: '[REDACTED]' },
    PHONE_NUMBER: { type: 'replace', new_value: '--Redacted phone number--' },
    EMAIL: { type: 'replace', new_value: '--Redacted email--' },
    CREDIT_CARD: { type: 'mask', masking_char: '*', chars_to_mask: 12, from_end: true },
    PERSON: { type: 'replace', new_value: '[PERSON]' },
    DATE_TIME: { type: 'replace', new_value: '[DATE]' },
    IP_ADDRESS: { type: 'replace', new_value: '[IP]' },
    US_SSN: { type: 'mask', masking_char: '*', chars_to_mask: 5, from_end: true }
  });

  const handleAnonymize = useCallback(async (text) => {
    if (!text || !text.trim()) {
      showError('Please enter some text to anonymize');
      return;
    }

    setIsLoading(true);
    try {
      const result = await anonymizeText(text, anonymizationOptions);
      setResults(result);
      showSuccess('Text anonymized successfully');
    } catch (error) {
      console.error('Anonymization failed:', error);
      showError('Failed to anonymize text. Please check if Presidio is running on localhost:5001');
    } finally {
      setIsLoading(false);
    }
  }, [anonymizationOptions]);

  const handleDeanonymize = useCallback(async (text, operatorResults) => {
    if (!text || !operatorResults || operatorResults.length === 0) {
      showError('Invalid data for deanonymization');
      return;
    }

    setIsLoading(true);
    try {
      const result = await deanonymizeText(text, operatorResults);
      setResults(prev => ({ ...prev, deanonymized: result }));
      showSuccess('Text deanonymized successfully');
    } catch (error) {
      console.error('Deanonymization failed:', error);
      showError('Failed to deanonymize text. Make sure the data was encrypted during anonymization.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileUpload = useCallback((content) => {
    setInputText(content);
  }, []);

  return (
    <ErrorBoundary>
      <Container>
        <Header>
          <Title>🔒 PII Anonymizer</Title>
          <Subtitle>Protect sensitive data with Presidio-powered anonymization</Subtitle>
        </Header>

        <MainContent>
          <Section>
            <SectionTitle>📁 Input</SectionTitle>
            <FileUpload onFileUpload={handleFileUpload} />
            <TextInput 
              value={inputText}
              onChange={setInputText}
              onAnonymize={handleAnonymize}
            />
          </Section>

          <Section>
            <SectionTitle>⚙️ Configuration</SectionTitle>
            <AnonymizationOptions 
              options={anonymizationOptions}
              onChange={setAnonymizationOptions}
            />
          </Section>
        </MainContent>

        {results && (
          <ResultsDisplay 
            results={results}
            onDeanonymize={handleDeanonymize}
          />
        )}

        {isLoading && (
          <LoadingOverlay>
            <LoadingSpinner />
          </LoadingOverlay>
        )}
      </Container>
    </ErrorBoundary>
  );
}

export default App; 