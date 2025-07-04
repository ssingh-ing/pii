import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const DropzoneContainer = styled.div`
  border: 2px dashed #ccc;
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    border-color: #667eea;
    background-color: #f8f9ff;
  }
  
  &.active {
    border-color: #667eea;
    background-color: #f0f2ff;
  }
`;

const DropzoneText = styled.p`
  margin: 0;
  color: #666;
  font-size: 16px;
  
  strong {
    color: #333;
  }
`;

const FileIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const SupportedFormats = styled.div`
  margin-top: 16px;
  font-size: 14px;
  color: #888;
`;

const FileUpload = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        onFileUpload(content);
      };
      reader.readAsText(file);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/markdown': ['.md'],
      'application/rtf': ['.rtf']
    },
    multiple: false
  });

  return (
    <DropzoneContainer 
      {...getRootProps()} 
      className={isDragActive ? 'active' : ''}
      role="button"
      aria-label="Upload file area"
      tabIndex={0}
    >
      <input {...getInputProps()} aria-label="File upload input" />
      <FileIcon aria-hidden="true">📄</FileIcon>
      <DropzoneText>
        {isDragActive ? (
          <strong>Drop the file here...</strong>
        ) : (
          <>
            <strong>Click to upload</strong> or drag and drop a document
          </>
        )}
      </DropzoneText>
      <SupportedFormats>
        Supported formats: TXT, CSV, JSON, MD, RTF
      </SupportedFormats>
    </DropzoneContainer>
  );
};

FileUpload.propTypes = {
  onFileUpload: PropTypes.func.isRequired
};

export default FileUpload;