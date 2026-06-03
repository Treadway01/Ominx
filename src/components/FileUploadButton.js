import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function FileUploadButton({ onFileContent }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickFile = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['text/*', 'application/pdf', 'application/json'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setLoading(false);
        return;
      }

      const file = result.assets[0];
      const content = await FileSystem.readAsStringAsync(file.uri);

      setUploadedFile({
        name: file.name,
        size: file.size,
        content: content,
      });

      setModalVisible(true);
      setLoading(false);

      if (onFileContent) {
        onFileContent(content, file.name);
      }
    } catch (error) {
      console.error('File pick error:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handlePickFile}>
        {loading ? (
          <ActivityIndicator color="#00f5ff" size="small" />
        ) : (
          <Text style={styles.buttonText}>⊕</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>FILE UPLOADED</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.fileInfo}>
              <Text style={styles.fileIcon}>◈</Text>
              <View>
                <Text style={styles.fileName}>{uploadedFile?.name}</Text>
                <Text style={styles.fileSize}>
                  {uploadedFile?.size
                    ? `${(uploadedFile.size / 1024).toFixed(1)} KB`
                    : ''}
                </Text>
              </View>
            </View>
            <ScrollView
              style={styles.contentPreview}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.contentText}>
                {uploadedFile?.content?.substring(0, 500)}
                {uploadedFile?.content?.length > 500 ? '...' : ''}
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.useBtn}
              onPress={() => {
                setModalVisible(false);
                if (onFileContent && uploadedFile) {
                  onFileContent(uploadedFile.content, uploadedFile.name);
                }
              }}
            >
              <Text style={styles.useBtnText}>ASK AI ABOUT THIS FILE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0a0a1a',
    borderWidth: 1,
    borderColor: '#1a1a3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#00f5ff66',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#0a0a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: '#00f5ff33',
    padding: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#00f5ff',
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '700',
  },
  closeBtn: {
    color: '#444',
    fontSize: 16,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#111128',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  fileIcon: {
    color: '#00f5ff',
    fontSize: 24,
  },
  fileName: {
    color: '#e0e0ff',
    fontSize: 14,
    fontWeight: '600',
  },
  fileSize: {
    color: '#444466',
    fontSize: 12,
    marginTop: 2,
  },
  contentPreview: {
    backgroundColor: '#050510',
    borderRadius: 10,
    padding: 12,
    maxHeight: 150,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a1a3a',
  },
  contentText: {
    color: '#444466',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'monospace',
  },
  useBtn: {
    backgroundColor: '#00f5ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  useBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
});