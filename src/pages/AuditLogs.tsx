import React, { useEffect, useState } from 'react';
import type { AuditLog, AuditLogFilters } from '../types';
import DataTable from '../components/DataTable';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 25;
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AuditLogFilters>({});

  useEffect(() => {
    loadLogs();
  }, [currentPage, pageSize, filters]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockLogs: AuditLog[] = [
        {
          id: '1',
          action: 'VENDOR_APPROVED',
          performedBy: 'admin-1',
          performedByName: 'Admin User',
          entityType: 'VENDOR',
          entityId: 'vendor-123',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          details: 'Approved vendor registration',
          ipAddress: '192.168.1.1'
        },
        {
          id: '2',
          action: 'USER_STATUS_UPDATED',
          performedBy: 'admin-1',
          performedByName: 'Admin User',
          entityType: 'USER',
          entityId: 'user-456',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          details: 'Updated user status to ACTIVE',
          ipAddress: '192.168.1.1'
        }
      ];
      setLogs(mockLogs);
      setTotal(mockLogs.length);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Time',
      render: (log: AuditLog) => (
        <span className="text-sm text-gray-600">
          {new Date(log.timestamp || log.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'performedBy',
      header: 'User',
      render: (log: AuditLog) => (
        <div>
          <p className="font-semibold text-gray-900">{log.performedByName || 'System'}</p>
          <p className="text-xs text-gray-500">{log.performedBy}</p>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (log: AuditLog) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
          {log.action}
        </span>
      ),
    },
    {
      key: 'entityType',
      header: 'Entity',
      render: (log: AuditLog) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{log.entityType}</p>
          <p className="text-xs text-gray-500">{log.entityId}</p>
        </div>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (log: AuditLog) => (
        <span className="text-sm text-gray-600">{log.details?.substring(0, 50)}...</span>
      ),
    },
  ];

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Audit Logs</h1>
            <p className="text-orange-100 mt-1">System activity and change tracking</p>
          </div>
          <FileText className="w-12 h-12 opacity-50" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Entity Type"
              value={filters.entityType || ''}
              onChange={(e) => setFilters({ ...filters, entityType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Action"
              value={filters.action || ''}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <input
              type="date"
              placeholder="Start Date"
              value={filters.startDate || ''}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <input
              type="date"
              placeholder="End Date"
              value={filters.endDate || ''}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <>
            <DataTable data={logs} columns={columns} />
            {totalPages > 1 && (
              <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, total)} of {total} logs
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
