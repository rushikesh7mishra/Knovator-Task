import React from 'react';
import { AlertCircle } from 'lucide-react';

const ImportHistoryTable = ({ logs }) => {
  const isArray = Array.isArray(logs);

  if (!isArray || logs.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-20">
        <AlertCircle className="mx-auto w-10 h-10 text-red-400 mb-2" />
        <p className="text-xl">No Import Logs Found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md">
      <table className="w-full table-auto text-sm text-left text-gray-700">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-600">
          <tr>
            <th className="px-6 py-4">Timestamp</th>
            <th className="px-6 py-4 text-center">Total</th>
            <th className="px-6 py-4 text-center text-green-600">New</th>
            <th className="px-6 py-4 text-center text-blue-600">Updated</th>
            <th className="px-6 py-4 text-center text-red-600">Failed</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {logs.map((log, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString()}</td>
              <td className="px-6 py-4 text-center font-semibold">{log.totalFetched}</td>
              <td className="px-6 py-4 text-center">
                <span className="rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs">
                  {log.newJobs}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="rounded-full bg-blue-100 text-blue-800 px-3 py-1 text-xs">
                  {log.updatedJobs}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`rounded-full px-3 py-1 text-xs ${log.failedJobs?.length > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-500'}`}>
                  {log.failedJobs?.length ?? 0}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImportHistoryTable;
