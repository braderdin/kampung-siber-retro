// Start: Imports
"use client";

import { useState } from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { enDictionary, msDictionary } from '@/i18n/dictionaries';
// End: Imports

// Start: Type Definitions
interface FileManagerActionsProps {
  onFileUpload: () => void;
  onFolderCreate: () => void;
  onFileCreate: () => void;
  selectedCount: number;
  onBatchDelete: () => void;
  className?: string;
}
// End: Type Definitions

// Start: FileManagerActions Component
export default function FileManagerActions({
  onFileUpload,
  onFolderCreate,
  onFileCreate,
  selectedCount,
  onBatchDelete,
  className
}: FileManagerActionsProps) {
  const { language } = useLanguageStore();
  const t = language === 'ms' ? msDictionary : enDictionary;
  
  // Start: State Management
  const [showCreateFileModal, setShowCreateFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  // End: State Management

  // Start: Handle Create File
  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onFileCreate();
      setShowCreateFileModal(false);
      setNewFileName('');
    }
  };
  // End: Handle Create File

  // Start: Handle Create Folder
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onFolderCreate();
      setShowCreateFolderModal(false);
      setNewFolderName('');
    }
  };
  // End: Handle Create Folder

  // Start: Handle Create File via Prompt
  const handleCreateFilePrompt = () => {
    const fileName = window.prompt('Masukkan nama fail:', 'index.html');
    if (fileName && fileName.trim()) {
      setNewFileName(fileName.trim());
      setShowCreateFileModal(true);
    }
  };
  // End: Handle Create File via Prompt

  // Start: Handle Create Folder via Prompt
  const handleCreateFolderPrompt = () => {
    const folderName = window.prompt('Masukkan nama folder:', 'folder_baru');
    if (folderName && folderName.trim()) {
      setNewFolderName(folderName.trim());
      setShowCreateFolderModal(true);
    }
  };
  // End: Handle Create Folder via Prompt

  // Start: Render Action Buttons
  return (
    <div className={`flex items-center space-x-2 mb-4 ${className || ''}`}>
      <button
        onClick={() => {}}
        className="retro-btn-secondary text-sm px-3 py-1"
        title="Select"
      >
        📋 Pilih
      </button>
      <button
        onClick={handleCreateFilePrompt}
        className="retro-btn-secondary text-sm px-3 py-1"
        title="New File"
      >
        📄 Fail Baru
      </button>
      <button
        onClick={handleCreateFolderPrompt}
        className="retro-btn-secondary text-sm px-3 py-1"
        title="New Folder"
      >
        📁 Folder Baru
      </button>
      <button
        onClick={onFileUpload}
        className="retro-btn-secondary text-sm px-3 py-1"
        title="Upload"
      >
        ⬆️ Muat Naik
      </button>
      {selectedCount > 0 && (
        <button
          onClick={onBatchDelete}
          className="retro-btn-secondary text-sm px-3 py-1 bg-red-500 hover:bg-red-600 text-white"
          title="Delete Selected"
        >
          🗑️ Padam
        </button>
      )}

      {/* Start: Create File Modal */}
      {showCreateFileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              Buat Fail Baru
            </h3>
            <input
              type="text"
              placeholder="Nama fail (contoh: index.html)"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="retro-input w-full mb-4"
              maxLength={50}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateFileModal(false)}
                className="retro-btn-secondary text-sm px-3 py-1"
              >
                Batal
              </button>
              <button
                onClick={handleCreateFile}
                className="retro-btn-primary text-sm px-3 py-1"
              >
                Buat
              </button>
            </div>
          </div>
        </div>
      )}
      {/* End: Create File Modal */}

      {/* Start: Create Folder Modal */}
      {showCreateFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
              Buat Folder Baru
            </h3>
            <input
              type="text"
              placeholder="Nama folder"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="retro-input w-full mb-4"
              maxLength={50}
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="retro-btn-secondary text-sm px-3 py-1"
              >
                Batal
              </button>
              <button
                onClick={handleCreateFolder}
                className="retro-btn-primary text-sm px-3 py-1"
              >
                Buat
              </button>
            </div>
          </div>
        </div>
      )}
      {/* End: Create Folder Modal */}
    </div>
  );
}
