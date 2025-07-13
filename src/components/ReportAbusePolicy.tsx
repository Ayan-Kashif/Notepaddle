import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  X, AlertTriangle, Mail, Shield, Calendar
} from 'lucide-react';

interface ReportAbusePolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportAbusePolicy: React.FC<ReportAbusePolicyProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('reportAbuse');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 mt-28 md:mt-2 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
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
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <h1 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
                {t('header')}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-red-700 dark:text-red-300">
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

            {/* Intro */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                {t('commitment_heading')}
              </h2>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {t('commitment_body')}
                </p>
              </div>
            </section>

            {/* Report Process */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                {t('report_heading')}
              </h2>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4">
                  {t('primary_method')}
                </h3>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>{t('email_label')}</strong> <span className="text-blue-600 dark:text-blue-400">support@notepadle.com</span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    <strong>{t('subject_line')}</strong>
                  </p>
                </div>

                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                  {t('please_include')}
                </h3>

                {['1', '2', '3', '4'].map(num => (
                  <div className="flex items-start space-x-3" key={num}>
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">{num}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{t(`step_${num}_title`)}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t(`step_${num}_desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact Info */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                {t('contact_heading')}
              </h2>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{t('abuse_reports_heading')}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {t('abuse_details.0')}<br />
                      {t('abuse_details.1')}<br />
                      {t('abuse_details.2')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">{t('general_support_heading')}</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {t('support_details.0')}<br />
                      {t('support_details.1')}<br />
                      {t('support_details.2')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Summary */}
            <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('summary_heading')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-red-700 dark:text-red-300">📧 {t('how_to')}</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {t('how_to_report', { returnObjects: true }).map((item: string, idx: number) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-orange-700 dark:text-orange-300">⏱️ {t('response_times_heading')}</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {t('response_times', { returnObjects: true }).map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-yellow-700 dark:text-yellow-300">🔒 {t('confidentiality_heading')}</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {t('confidentiality', { returnObjects: true }).map((item: string, idx: number) => (
                      <li key={idx}>{item}</li>
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

export default ReportAbusePolicy;

