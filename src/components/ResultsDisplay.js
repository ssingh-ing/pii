import React, { useState } from 'react';
import styled from 'styled-components';

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Text copied to clipboard!');
    });
  };

  const handleDeanonymize = () => {
    if (results.operator_results && results.operator_results.length > 0) {
      onDeanonymize(results.anonymized, results.operator_results);
    } else {
      alert('No operator results available for deanonymization');
    }
  };

  const renderHighlightedText = (text, entities) => {
    if (!entities || entities.length === 0) return text;

    let highlightedText = text;
    let offset = 0;

    // Sort entities by start position
    const sortedEntities = [...entities].sort((a, b) => a.start - b.start);

    sortedEntities.forEach((entity) => {
      const beforeText = highlightedText.slice(0, entity.start + offset);
      const entityText = highlightedText.slice(entity.start + offset, entity.end + offset);
      const afterText = highlightedText.slice(entity.end + offset);
      
      const highlighted = `<span style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 3px; font-weight: bold;" title="${entity.entity_type} (${entity.score})">${entityText}</span>`;
      
      highlightedText = beforeText + highlighted + afterText;
      offset += highlighted.length - entityText.length;
    });

    return <div dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  const entityStats = results.entities ? results.entities.reduce((acc, entity) => {
    acc[entity.entity_type] = (acc[entity.entity_type] || 0) + 1;
    return acc;
  }, {}) : {};

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

      <TabContainer>
        <Tab active={activeTab === 'original'} onClick={() => setActiveTab('original')}>
          📝 Original Text
        </Tab>
        <Tab active={activeTab === 'anonymized'} onClick={() => setActiveTab('anonymized')}>
          🔒 Anonymized Text
        </Tab>
        <Tab active={activeTab === 'entities'} onClick={() => setActiveTab('entities')}>
          🏷️ Detected Entities
        </Tab>
        <Tab active={activeTab === 'metadata'} onClick={() => setActiveTab('metadata')}>
          📋 Metadata
        </Tab>
        {results.deanonymized && (
          <Tab active={activeTab === 'deanonymized'} onClick={() => setActiveTab('deanonymized')}>
            🔓 Deanonymized
          </Tab>
        )}
      </TabContainer>

      {activeTab === 'original' && (
        <TextDisplay>
          {results.entities ? 
            renderHighlightedText(results.original, results.entities) : 
            results.original
          }
        </TextDisplay>
      )}

      {activeTab === 'anonymized' && (
        <TextDisplay>
          {results.anonymized}
        </TextDisplay>
      )}

      {activeTab === 'entities' && (
        <EntitiesContainer>
          <div style={{ marginBottom: '15px' }}>
            {Object.entries(entityStats).map(([type, count]) => (
              <EntityBadge key={type}>
                {type}: {count}
              </EntityBadge>
            ))}
          </div>
          {results.entities && results.entities.map((entity, index) => (
            <EntityInfo key={index}>
              <div><strong>Type:</strong> {entity.entity_type}</div>
              <div><strong>Text:</strong> <EntityText>{results.original.slice(entity.start, entity.end)}</EntityText></div>
              <div><strong>Position:</strong> {entity.start}-{entity.end}</div>
              <div><strong>Confidence:</strong> {Math.round(entity.score * 100)}%</div>
            </EntityInfo>
          ))}
        </EntitiesContainer>
      )}

      {activeTab === 'metadata' && (
        <JsonDisplay>
          {JSON.stringify(results, null, 2)}
        </JsonDisplay>
      )}

      {activeTab === 'deanonymized' && results.deanonymized && (
        <TextDisplay>
          {results.deanonymized.text}
        </TextDisplay>
      )}

      <ActionButtons>
        <CopyButton onClick={() => copyToClipboard(results.anonymized)}>
          📋 Copy Anonymized Text
        </CopyButton>
        <DownloadButton onClick={() => downloadText(results.anonymized, 'anonymized_text.txt')}>
          💾 Download Anonymized
        </DownloadButton>
        <DeanonymizeButton onClick={handleDeanonymize}>
          🔓 Deanonymize
        </DeanonymizeButton>
      </ActionButtons>
    </Container>
  );
};

export default ResultsDisplay; 