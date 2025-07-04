import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { sanitizeHtml, createHighlightedSpan } from '../utils/sanitizer';
import { showSuccess, showError } from '../utils/notifications';

const Container = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const Title = styled.h2`
  color: #333;
  margin: 0;
  font-size: 1.5em;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: 2px solid #667eea;
  border-radius: 8px;
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#667eea'};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? '#5a6fd8' : '#f0f2ff'};
  }
  
  &:focus {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }
  
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;

const TextDisplay = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const EntitiesContainer = styled.div`
  margin-bottom: 20px;
`;

const EntityBadge = styled.span`
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin: 2px;
`;

const EntityInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

const EntityText = styled.span`
  background: #ffeb3b;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: bold;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const DownloadButton = styled(Button)`
  background: #4caf50;
  color: white;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
`;

const CopyButton = styled(Button)`
  background: #2196f3;
  color: white;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  }
`;

const DeanonymizeButton = styled(Button)`
  background: #ff9800;
  color: white;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 5px;
`;

const JsonDisplay = styled.pre`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ResultsDisplay = ({ results, onDeanonymize }) => {
  const [activeTab, setActiveTab] = useState('original');

  const downloadText = (text, filename) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess('Text copied to clipboard!');
    } catch (error) {
      showError('Failed to copy text to clipboard');
    }
  }, []);

  const handleDeanonymize = useCallback(() => {
    if (results.operator_results && results.operator_results.length > 0) {
      onDeanonymize(results.anonymized, results.operator_results);
    } else {
      showError('No operator results available for deanonymization');
    }
  }, [results.operator_results, results.anonymized, onDeanonymize]);

  const renderHighlightedText = useMemo(() => {
    return (text, entities) => {
      if (!entities || entities.length === 0) return text;

      let highlightedText = text;
      let offset = 0;

      // Sort entities by start position to avoid overlap issues
      const sortedEntities = [...entities].sort((a, b) => a.start - b.start);

      sortedEntities.forEach((entity) => {
        const beforeText = highlightedText.slice(0, entity.start + offset);
        const entityText = highlightedText.slice(entity.start + offset, entity.end + offset);
        const afterText = highlightedText.slice(entity.end + offset);
        
        const highlighted = createHighlightedSpan(entityText, entity.entity_type, entity.score);
        
        highlightedText = beforeText + highlighted + afterText;
        offset += highlighted.length - entityText.length;
      });

      return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(highlightedText) }} />;
    };
  }, []);

  const entityStats = useMemo(() => {
    return results.entities ? results.entities.reduce((acc, entity) => {
      acc[entity.entity_type] = (acc[entity.entity_type] || 0) + 1;
      return acc;
    }, {}) : {};
  }, [results.entities]);

  return (
    <Container>
      <Header>
        <Title>📊 Results</Title>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatValue>{results.entities ? results.entities.length : 0}</StatValue>
          <StatLabel>PII Entities Found</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{Object.keys(entityStats).length}</StatValue>
          <StatLabel>Entity Types</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{results.original ? results.original.length : 0}</StatValue>
          <StatLabel>Original Characters</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{results.anonymized ? results.anonymized.length : 0}</StatValue>
          <StatLabel>Anonymized Characters</StatLabel>
        </StatCard>
      </StatsContainer>

      <TabContainer role="tablist" aria-label="Results display options">
        <Tab 
          active={activeTab === 'original'} 
          onClick={() => setActiveTab('original')}
          role="tab"
          aria-selected={activeTab === 'original'}
          aria-controls="original-panel"
          id="original-tab"
        >
          📝 Original Text
        </Tab>
        <Tab 
          active={activeTab === 'anonymized'} 
          onClick={() => setActiveTab('anonymized')}
          role="tab"
          aria-selected={activeTab === 'anonymized'}
          aria-controls="anonymized-panel"
          id="anonymized-tab"
        >
          🔒 Anonymized Text
        </Tab>
        <Tab 
          active={activeTab === 'entities'} 
          onClick={() => setActiveTab('entities')}
          role="tab"
          aria-selected={activeTab === 'entities'}
          aria-controls="entities-panel"
          id="entities-tab"
        >
          🏷️ Detected Entities
        </Tab>
        <Tab 
          active={activeTab === 'metadata'} 
          onClick={() => setActiveTab('metadata')}
          role="tab"
          aria-selected={activeTab === 'metadata'}
          aria-controls="metadata-panel"
          id="metadata-tab"
        >
          📋 Metadata
        </Tab>
        {results.deanonymized && (
          <Tab 
            active={activeTab === 'deanonymized'} 
            onClick={() => setActiveTab('deanonymized')}
            role="tab"
            aria-selected={activeTab === 'deanonymized'}
            aria-controls="deanonymized-panel"
            id="deanonymized-tab"
          >
            🔓 Deanonymized
          </Tab>
        )}
      </TabContainer>

      {activeTab === 'original' && (
        <TextDisplay 
          role="tabpanel" 
          aria-labelledby="original-tab"
          id="original-panel"
        >
          {results.entities ? 
            renderHighlightedText(results.original, results.entities) : 
            results.original
          }
        </TextDisplay>
      )}

      {activeTab === 'anonymized' && (
        <TextDisplay 
          role="tabpanel" 
          aria-labelledby="anonymized-tab"
          id="anonymized-panel"
        >
          {results.anonymized}
        </TextDisplay>
      )}

      {activeTab === 'entities' && (
        <EntitiesContainer 
          role="tabpanel" 
          aria-labelledby="entities-tab"
          id="entities-panel"
        >
          <div style={{ marginBottom: '15px' }}>
            {Object.entries(entityStats).map(([type, count]) => (
              <EntityBadge key={type} aria-label={`${type}: ${count} entities`}>
                {type}: {count}
              </EntityBadge>
            ))}
          </div>
          {results.entities && results.entities.map((entity, index) => (
            <EntityInfo key={index} role="group" aria-label={`Entity ${index + 1}`}>
              <div><strong>Type:</strong> {entity.entity_type}</div>
              <div><strong>Text:</strong> <EntityText>{results.original.slice(entity.start, entity.end)}</EntityText></div>
              <div><strong>Position:</strong> {entity.start}-{entity.end}</div>
              <div><strong>Confidence:</strong> {Math.round(entity.score * 100)}%</div>
            </EntityInfo>
          ))}
        </EntitiesContainer>
      )}

      {activeTab === 'metadata' && (
        <JsonDisplay 
          role="tabpanel" 
          aria-labelledby="metadata-tab"
          id="metadata-panel"
        >
          {JSON.stringify(results, null, 2)}
        </JsonDisplay>
      )}

      {activeTab === 'deanonymized' && results.deanonymized && (
        <TextDisplay 
          role="tabpanel" 
          aria-labelledby="deanonymized-tab"
          id="deanonymized-panel"
        >
          {results.deanonymized.text}
        </TextDisplay>
      )}

      <ActionButtons>
        <CopyButton 
          onClick={() => copyToClipboard(results.anonymized)}
          aria-label="Copy anonymized text to clipboard"
        >
          📋 Copy Anonymized Text
        </CopyButton>
        <DownloadButton 
          onClick={() => downloadText(results.anonymized, 'anonymized_text.txt')}
          aria-label="Download anonymized text as file"
        >
          💾 Download Anonymized
        </DownloadButton>
        <DeanonymizeButton 
          onClick={handleDeanonymize}
          aria-label="Deanonymize the text"
        >
          🔓 Deanonymize
        </DeanonymizeButton>
      </ActionButtons>
    </Container>
  );
};

ResultsDisplay.propTypes = {
  results: PropTypes.shape({
    original: PropTypes.string,
    anonymized: PropTypes.string,
    entities: PropTypes.arrayOf(PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
      score: PropTypes.number.isRequired,
      entity_type: PropTypes.string.isRequired
    })),
    operator_results: PropTypes.array,
    deanonymized: PropTypes.shape({
      text: PropTypes.string
    })
  }).isRequired,
  onDeanonymize: PropTypes.func.isRequired
};

export default ResultsDisplay;