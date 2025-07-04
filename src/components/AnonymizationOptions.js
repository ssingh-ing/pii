import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const EntityGroup = styled.div`
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  background: #f9f9f9;
`;

const EntityTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const OperatorSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const OptionRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
`;

const OptionLabel = styled.label`
  min-width: 100px;
  font-size: 14px;
  color: #666;
`;

const OptionInput = styled.input`
  flex: 1;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const OptionCheckbox = styled.input`
  margin-right: 8px;
`;

const EntityIcon = {
  'DEFAULT': '🛡️',
  'PHONE_NUMBER': '📞',
  'EMAIL': '📧',
  'CREDIT_CARD': '💳',
  'PERSON': '👤',
  'DATE_TIME': '📅',
  'IP_ADDRESS': '🌐',
  'US_SSN': '🆔'
};

const AnonymizationOptions = ({ options, onChange }) => {

  const updateOption = (entityType, field, value) => {
    onChange(prev => ({
      ...prev,
      [entityType]: {
        ...prev[entityType],
        [field]: value
      }
    }));
  };

  const renderOperatorOptions = (entityType, operatorConfig) => {
    const { type } = operatorConfig;
    
    switch (type) {
      case 'replace':
        return (
          <OptionRow>
            <OptionLabel>Replace with:</OptionLabel>
            <OptionInput
              type="text"
              value={operatorConfig.new_value || ''}
              onChange={(e) => updateOption(entityType, 'new_value', e.target.value)}
              placeholder="Enter replacement text"
            />
          </OptionRow>
        );
        
      case 'mask':
        return (
          <>
            <OptionRow>
              <OptionLabel>Mask char:</OptionLabel>
              <OptionInput
                type="text"
                maxLength="1"
                value={operatorConfig.masking_char || '*'}
                onChange={(e) => updateOption(entityType, 'masking_char', e.target.value)}
              />
            </OptionRow>
            <OptionRow>
              <OptionLabel>Chars to mask:</OptionLabel>
              <OptionInput
                type="number"
                min="1"
                value={operatorConfig.chars_to_mask || 4}
                onChange={(e) => updateOption(entityType, 'chars_to_mask', parseInt(e.target.value))}
              />
            </OptionRow>
            <OptionRow>
              <OptionLabel>
                <OptionCheckbox
                  type="checkbox"
                  checked={operatorConfig.from_end || false}
                  onChange={(e) => updateOption(entityType, 'from_end', e.target.checked)}
                />
                Mask from end
              </OptionLabel>
            </OptionRow>
          </>
        );
        
      case 'hash':
        return (
          <OptionRow>
            <OptionLabel>Hash type:</OptionLabel>
            <OptionInput
              type="text"
              value={operatorConfig.hash_type || 'sha256'}
              onChange={(e) => updateOption(entityType, 'hash_type', e.target.value)}
              placeholder="sha256, md5, etc."
            />
          </OptionRow>
        );
        
      case 'encrypt':
        return (
          <OptionRow>
            <OptionLabel>Encryption key:</OptionLabel>
            <OptionInput
              type="password"
              value={operatorConfig.key || ''}
              onChange={(e) => updateOption(entityType, 'key', e.target.value)}
              placeholder="Enter encryption key"
            />
          </OptionRow>
        );
        
      case 'redact':
      default:
        return null;
    }
  };

  return (
    <Container>
      {Object.entries(options).map(([entityType, operatorConfig]) => (
        <EntityGroup key={entityType}>
          <EntityTitle>
            {EntityIcon[entityType] || '🔒'} {entityType}
          </EntityTitle>
          
          <OperatorSelect
            value={operatorConfig.type}
            onChange={(e) => updateOption(entityType, 'type', e.target.value)}
          >
            <option value="replace">Replace</option>
            <option value="mask">Mask</option>
            <option value="redact">Redact</option>
            <option value="hash">Hash</option>
            <option value="encrypt">Encrypt</option>
          </OperatorSelect>
          
          {renderOperatorOptions(entityType, operatorConfig)}
        </EntityGroup>
      ))}
    </Container>
  );
};

AnonymizationOptions.propTypes = {
  options: PropTypes.objectOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    new_value: PropTypes.string,
    masking_char: PropTypes.string,
    chars_to_mask: PropTypes.number,
    from_end: PropTypes.bool,
    hash_type: PropTypes.string,
    key: PropTypes.string
  })).isRequired,
  onChange: PropTypes.func.isRequired
};

export default AnonymizationOptions;