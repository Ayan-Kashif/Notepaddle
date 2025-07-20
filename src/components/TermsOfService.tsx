import React,{useState,useEffect} from 'react';
import { X, FileText, Shield, Users, AlertTriangle, Scale, Mail, Calendar } from 'lucide-react';
import '../i18n';
import { useTranslation } from 'react-i18next';

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ isOpen, onClose }) => {
 const [ready, setReady] = useState(false);
  const { t,i18n } = useTranslation('terms');
  useEffect(() => {
    if (isOpen) {
      i18n.loadNamespaces('terms').then(() => {
        setReady(true);
      });
    }
  }, [isOpen]);



  if (!isOpen || !ready) return null;

  return (
    <div className="fixed inset-0 mt-28 md:mt-2 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('title')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('subtitle')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-gray dark:prose-invert max-w-none">

            {/* Header */}
            <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <h1 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                {t('header')}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-green-700 dark:text-green-300">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span><strong>{t('effective')}:</strong> {t('effective_date')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span><strong>{t('updated')}:</strong> {t('last_updated')}</span>
                </div>
              </div>
            </div>

            {/* Sections */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                <Scale className="w-5 h-5 mr-2 text-indigo-600" />
                {t('accept_heading')}
              </h2>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('accept_text')}
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                {t('description_heading')}
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t('description_intro')}</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {t('description_list', { returnObjects: true }).map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-3">{t('description_note')}</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                {t('contact_heading')}
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t('contact_intro')}</p>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p><strong>{t('contact_email_label')}</strong> {t('contact_email')}</p>
                  <p><strong>{t('contact_subject_label')}</strong> {t('contact_subject')}</p>
                  <p><strong>{t('contact_time_label')}</strong> {t('contact_time')}</p>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('summary_heading')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-green-700 dark:text-green-300">{t('summary_rights_heading')}</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {t('summary_rights_list', { returnObjects: true }).map((item: string, i: number) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-blue-700 dark:text-blue-300">{t('summary_resp_heading')}</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {t('summary_resp_list', { returnObjects: true }).map((item: string, i: number) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
