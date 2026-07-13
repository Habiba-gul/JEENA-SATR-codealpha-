import React, { useState } from 'react';
import { DJANGO_MODELS_CODE, STATIC_IMAGES_FOLDERS_STRUCTURE, SYSTEM_ARCH_BLUEPRINT } from '../data';
import { Copy, Check, FileCode, FolderGit2, Compass, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AdminBlueprint() {
  const [activeTab, setActiveTab] = useState<'django' | 'folders' | 'arch'>('django');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let textToCopy = '';
    if (activeTab === 'django') textToCopy = DJANGO_MODELS_CODE;
    else if (activeTab === 'folders') textToCopy = STATIC_IMAGES_FOLDERS_STRUCTURE;
    else textToCopy = SYSTEM_ARCH_BLUEPRINT;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-[#1F1F1F]/10 shadow-lg text-[#1F1F1F] font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-[#1F1F1F]/10">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-[#1F1F1F] flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-[#1F1F1F]" />
            Jeena Satr Dev Hub
          </h2>
          <p className="text-xs text-[#1F1F1F]/70 mt-1 font-sans">
            Export ready-to-use Django models, folder structures, and architecture specifications.
          </p>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#1F1F1F] text-[#F5F5DC] hover:bg-[#333333] transition-colors rounded-lg text-xs font-medium cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Active Code
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        <button
          onClick={() => { setActiveTab('django'); setCopied(false); }}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'django'
              ? 'bg-[#1F1F1F] text-[#F5F5DC] border-[#1F1F1F]'
              : 'bg-white text-[#1F1F1F] border-[#1F1F1F]/10 hover:border-[#1F1F1F]/30'
          }`}
        >
          <FileCode className="w-4 h-4" />
          Django models.py
        </button>

        <button
          onClick={() => { setActiveTab('folders'); setCopied(false); }}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'folders'
              ? 'bg-[#1F1F1F] text-[#F5F5DC] border-[#1F1F1F]'
              : 'bg-white text-[#1F1F1F] border-[#1F1F1F]/10 hover:border-[#1F1F1F]/30'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          Static Directory Map
        </button>

        <button
          onClick={() => { setActiveTab('arch'); setCopied(false); }}
          className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'arch'
              ? 'bg-[#1F1F1F] text-[#F5F5DC] border-[#1F1F1F]'
              : 'bg-white text-[#1F1F1F] border-[#1F1F1F]/10 hover:border-[#1F1F1F]/30'
          }`}
        >
          <Compass className="w-4 h-4" />
          System Architecture
        </button>
      </div>

      {/* Active Tab Content Viewer */}
      <div className="relative bg-stone-900 rounded-lg p-4 font-mono text-xs text-[#F5F5DC] leading-relaxed border border-[#1F1F1F]/20 overflow-x-auto max-h-[480px]">
        {activeTab === 'django' && (
          <pre className="text-[11px] font-mono leading-relaxed text-emerald-300">
            <code>{DJANGO_MODELS_CODE}</code>
          </pre>
        )}

        {activeTab === 'folders' && (
          <pre className="text-[11px] font-mono leading-relaxed text-amber-200">
            <code>{STATIC_IMAGES_FOLDERS_STRUCTURE}</code>
          </pre>
        )}

        {activeTab === 'arch' && (
          <pre className="text-[11px] font-mono leading-relaxed text-sky-200">
            <code>{SYSTEM_ARCH_BLUEPRINT}</code>
          </pre>
        )}
      </div>

      {/* Additional Architecture Notes */}
      <div className="mt-4 p-4 rounded-lg bg-[#1F1F1F]/5 border border-[#1F1F1F]/10 text-xs">
        <h4 className="font-serif font-semibold text-[#1F1F1F] mb-1 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          Django Integration Guideline
        </h4>
        <p className="text-[#1F1F1F]/80 leading-relaxed">
          The models above include custom User management with roles and complete Cart/Order workflows. When migrating images, ensure that your media folder is served via your Nginx or static file serving configuration and mapped precisely to the specified dynamic <code>image_path</code> values.
        </p>
      </div>
    </div>
  );
}
