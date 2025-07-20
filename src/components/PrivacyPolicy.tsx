import React,{useState,useEffect} from 'react';
import { X, Shield, Eye, Lock, Database, Users, Mail, Calendar } from 'lucide-react';
import '../i18n';
import { useTranslation } from 'react-i18next';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose }) => {
  const [ready, setReady] = useState(false);
 const { t ,i18n} = useTranslation('privacy');
  useEffect(() => {
    if (isOpen) {
      i18n.loadNamespaces('privacy').then(() => {
        setReady(true);
      });
    }
  }, [isOpen]);

 

  if (!isOpen || !ready) return null;

  return (
    <div className="fixed inset-0 bg-black/50 mt-28 md:mt-2 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('title')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {/* Header */}
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-2">{t('header_title')}</h1>
              <div className="flex items-center space-x-4 text-sm text-blue-700 dark:text-blue-300">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{t('effective_date')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{t('last_updated')}</span>
                </div>
              </div>
            </div>

            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                {t('introduction_heading')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('introduction_body')}
              </p>
            </section>

            {/* What Data We Collect */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-green-600" />
                {t('data_collection_heading')}
              </h2>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Eye className="w-4 h-4 mr-2 text-gray-600" />
                    {t('anonymous_heading')}
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {t('anonymous_list', { returnObjects: true }).map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-indigo-600" />
                    {t('registered_heading')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{t('registered_intro')}</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {t('registered_list', { returnObjects: true }).map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Data */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-purple-600" />
                {t('use_data_heading')}
              </h2>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {t('use_data_list', { returnObjects: true }).map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Email Communications */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                {t('email_heading')}
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t('email_intro')}</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                  {t('email_list', { returnObjects: true }).map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-3">{t('email_note')}</p>
              </div>
            </section>

            {/* Cookies & LocalStorage */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('cookies_heading')}
              </h2>
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    {t('localstorage_heading')}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {t('localstorage_list', { returnObjects: true }).map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    {t('cookies_usage_heading')}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                    {t('cookies_usage_list', { returnObjects: true }).map((item: string, i: number) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                {t('contact_heading')}
              </h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">{t('contact_intro')}</p>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <p>{t('contact_email')}</p>
                  <p>{t('contact_response')}</p>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('summary_heading')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-green-700 dark:text-green-300">{t('summary_do')}</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {t('summary_do_list', { returnObjects: true }).map((item: string, i: number) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-red-700 dark:text-red-300">{t('summary_dont')}</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {t('summary_dont_list', { returnObjects: true }).map((item: string, i: number) => (
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

export default PrivacyPolicy;

