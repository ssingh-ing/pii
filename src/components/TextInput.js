import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  margin-bottom: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
  
  &::placeholder {
    color: #888;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ClearButton = styled(Button)`
  background: #f44336;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
  }
`;

const CharCount = styled.div`
  text-align: right;
  margin-top: 8px;
  font-size: 12px;
  color: #666;
`;

const TextInput = ({ value, onChange, onAnonymize }) => {
  const handleClear = () => {
    onChange('');
  };

  const handleAnonymize = () => {
    if (value.trim()) {
      onAnonymize(value);
    }
  };

  return (
    <Container>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter or paste your text here to anonymize sensitive information..."
        aria-label="Text input for anonymization"
        aria-describedby="char-count"
      />
      <CharCount id="char-count">
        {value.length} characters
      </CharCount>
      <ButtonContainer>
        <Button 
          onClick={handleAnonymize}
          disabled={!value.trim()}
          aria-label="Anonymize the entered text"
        >
          🔒 Anonymize Text
        </Button>
        <ClearButton 
          onClick={handleClear}
          disabled={!value}
          aria-label="Clear the text input"
        >
          🗑️ Clear
        </ClearButton>
      </ButtonContainer>
    </Container>
  );
};

TextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onAnonymize: PropTypes.func.isRequired
};

export default TextInput;