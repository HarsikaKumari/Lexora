import { useState } from 'react'
import { FileText, Download, CheckCircle, Clock, Save, FilePlus } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { saveDocumentMetadata } from '../../firebase/services'

const TEMPLATES = [
  { id: 'nda', name: 'Non-Disclosure Agreement', category: 'Corporate' },
  { id: 'service', name: 'Service Contract', category: 'Business' },
  { id: 'lease', name: 'Residential Lease', category: 'Real Estate' }
]

export default function DocumentBuilder({ user }) {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0])
  const [formData, setFormData] = useState({
    partyA: '',
    partyB: '',
    effectiveDate: '',
    jurisdiction: 'New York'
  })

  const handleDownload = async () => {
    try {
      if (!selectedTemplate) {
        console.error("Template not selected");
        return;
      }

      const doc = new jsPDF();

      // Title
      doc.setFontSize(22);
      doc.text(selectedTemplate?.name?.toUpperCase() || "AGREEMENT", 20, 20);

      doc.setFontSize(14);

      // Content with fallback
      const effectiveDate = formData?.effectiveDate || "N/A";
      const partyA = formData?.partyA || "N/A";
      const partyB = formData?.partyB || "N/A";
      const jurisdiction = formData?.jurisdiction || "N/A";

      doc.text(`This agreement is made on ${effectiveDate} between:`, 20, 40);
      doc.text(`Party A: ${partyA}`, 20, 50);
      doc.text(`Party B: ${partyB}`, 20, 60);
      doc.text(`Subject to the jurisdiction of ${jurisdiction}.`, 20, 80);

      // Save to Firestore
      if (user?.uid) {
        try {
          await saveDocumentMetadata({
            name: `${selectedTemplate.id}_contract.pdf`,
            category: selectedTemplate.category,
            userId: user.uid,
            templateId: selectedTemplate.id,
            partyA,
            partyB,
          });

          console.log("Metadata saved successfully ✅");
        } catch (error) {
          console.error("Error saving document metadata:", error);
        }
      }

      // Download PDF
      doc.save(`${selectedTemplate.id}_contract.pdf`);

    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };
  return (
    <div className="min-h-screen pt-24 pb-20 bg-secondary-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form Control */}
          <div className="lg:w-1/2 space-y-8">
            <div className="card p-8">
              <h2 className="text-3xl font-serif font-bold text-secondary-950 mb-6">Smart Document Builder</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-secondary-700 mb-2">Select Template</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {TEMPLATES.map((tpl) => (
                      <button 
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${selectedTemplate.id === tpl.id ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-200' : 'border-secondary-100 hover:border-secondary-300'}`}
                      >
                        <FilePlus className={`h-5 w-5 mb-2 ${selectedTemplate.id === tpl.id ? 'text-primary-600' : 'text-secondary-400'}`} />
                        <span className={`text-sm font-bold ${selectedTemplate.id === tpl.id ? 'text-primary-600' : 'text-secondary-700'}`}>{tpl.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-secondary-700 mb-1">Party A Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Full Legal Name" 
                      onChange={(e) => setFormData({...formData, partyA: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-secondary-700 mb-1">Party B Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="Full Legal Name" 
                      onChange={(e) => setFormData({...formData, partyB: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-secondary-700 mb-1">Effective Date</label>
                    <input 
                      type="date" 
                      className="input-field" 
                      onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-secondary-700 mb-1">Jurisdiction</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={formData.jurisdiction}
                      onChange={(e) => setFormData({...formData, jurisdiction: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={handleDownload} className="btn btn-primary flex-grow group active:scale-95 transition-transform">
                    <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform" /> 
                    Generate PDF
                  </button>
                  <button className="btn btn-outline px-4 text-secondary-600 border-secondary-200">
                    <Save className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Preview */}
          <div className="lg:w-1/2">
            <div className="card p-10 min-h-[600px] border-dashed border-2 relative bg-secondary-900 border-secondary-800 shadow-2xl">
              <div className="absolute top-4 right-4 animate-pulse">
                <span className="bg-primary-500 text-white text-[10px] font-bold px-2 py-1 rounded">PREVIEW</span>
              </div>
              
              <div className="bg-white p-12 text-secondary-900 font-serif shadow shadow-white/10 rounded-sm scale-95 origin-top transform-gpu">
                <h1 className="text-3xl font-bold mb-8 text-center uppercase tracking-widest">{selectedTemplate.name}</h1>
                <p className="mb-4 text-sm leading-loose">
                  This {selectedTemplate.name} ("Agreement") is entered into as of 
                  <span className="font-bold border-b border-primary-300 mx-1 px-2">{formData.effectiveDate || '__________'}</span> 
                  by and between <span className="font-bold border-b border-primary-300 mx-1 px-2 uppercase">{formData.partyA || '__________'}</span> 
                  ("Party A") and <span className="font-bold border-b border-primary-300 mx-1 px-2 uppercase">{formData.partyB || '__________'}</span> ("Party B").
                </p>
                <p className="mb-8 text-sm leading-loose">
                  The parties agree to the terms and conditions outlined in the full version of this document under the laws of 
                  <span className="font-bold border-b border-primary-300 mx-1 px-2">{formData.jurisdiction || '__________'}</span>.
                </p>
                
                <div className="mt-20 flex justify-between gap-12">
                  <div className="w-1/2 border-t-2 border-secondary-200 pt-2 text-[10px] font-bold text-secondary-400">SIGNATURE (PARTY A)</div>
                  <div className="w-1/2 border-t-2 border-secondary-200 pt-2 text-[10px] font-bold text-secondary-400">SIGNATURE (PARTY B)</div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-6 text-primary-300/50">
                 <div className="flex items-center gap-2 text-xs">
                   <Clock className="h-3 w-3" /> Auto-saved
                 </div>
                 <div className="flex items-center gap-2 text-xs">
                   <CheckCircle className="h-3 w-3" /> Encrypted
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
