import { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MaestroProcesses } from '@uipath/uipath-typescript/maestro-processes';
import type { MaestroProcessGetAllResponse } from '@uipath/uipath-typescript/maestro-processes';

const PAGE_SIZE = 25;

function StatusBadge({ count, label, color }: { count: number; label: string; color: string }) {
  if (count === 0) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {count} {label}
    </span>
  );
}

function ProcessCard({ process }: { process: MaestroProcessGetAllResponse }) {
  const total =
    (process.runningCount ?? 0) +
    (process.faultedCount ?? 0) +
    (process.completedCount ?? 0) +
    (process.pausedCount ?? 0) +
    (process.cancelledCount ?? 0) +
    (process.pendingCount ?? 0) +
    (process.retryingCount ?? 0) +
    (process.resumingCount ?? 0) +
    (process.pausingCount ?? 0) +
    (process.cancelingCount ?? 0);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col gap-3 min-w-0">
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="min-w-0">
          <h3
            className="text-sm font-semibold text-gray-900 truncate"
            title={process.name}
          >
            {process.name}
          </h3>
          <p
            className="text-xs text-gray-500 truncate mt-0.5"
            title={process.folderName}
          >
            {process.folderName}
          </p>
        </div>
        <span className="shrink-0 text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded font-mono whitespace-nowrap">
          v{process.versionCount}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <StatusBadge count={process.runningCount ?? 0} label="Running" color="bg-blue-100 text-blue-700" />
        <StatusBadge count={process.pendingCount ?? 0} label="Pending" color="bg-yellow-100 text-yellow-700" />
        <StatusBadge count={process.faultedCount ?? 0} label="Faulted" color="bg-red-100 text-red-700" />
        <StatusBadge count={process.completedCount ?? 0} label="Completed" color="bg-green-100 text-green-700" />
        <StatusBadge count={process.pausedCount ?? 0} label="Paused" color="bg-orange-100 text-orange-700" />
        <StatusBadge count={process.cancelledCount ?? 0} label="Cancelled" color="bg-gray-100 text-gray-600" />
        <StatusBadge count={process.retryingCount ?? 0} label="Retrying" color="bg-purple-100 text-purple-700" />
        <StatusBadge count={process.resumingCount ?? 0} label="Resuming" color="bg-teal-100 text-teal-700" />
        {total === 0 && (
          <span className="text-xs text-gray-400 italic">No active instances</span>
        )}
      </div>

      <div className="flex items-center gap-3 pt-1 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Package: <span className="font-mono text-gray-700 truncate" title={process.packageId}>{process.packageId}</span>
        </span>
      </div>
    </div>
  );
}

function ProcessRow({ process, index }: { process: MaestroProcessGetAllResponse; index: number }) {
  return (
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-4 py-3 max-w-0 w-56">
        <div className="truncate text-sm font-medium text-gray-900" title={process.name}>{process.name}</div>
        <div className="truncate text-xs text-gray-500 mt-0.5" title={process.folderName}>{process.folderName}</div>
      </td>
      <td className="px-4 py-3 max-w-0 w-48">
        <span className="truncate text-xs font-mono text-gray-600 block" title={process.packageId}>{process.packageId}</span>
      </td>
      <td className="px-4 py-3 text-center text-sm">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{process.versionCount}</span>
      </td>
      <td className="px-4 py-3 text-center">
        {(process.runningCount ?? 0) > 0
          ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{process.runningCount}</span>
          : <span className="text-gray-300 text-xs">—</span>}
      </td>
      <td className="px-4 py-3 text-center">
        {(process.pendingCount ?? 0) > 0
          ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">{process.pendingCount}</span>
          : <span className="text-gray-300 text-xs">—</span>}
      </td>
      <td className="px-4 py-3 text-center">
        {(process.faultedCount ?? 0) > 0
          ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">{process.faultedCount}</span>
          : <span className="text-gray-300 text-xs">—</span>}
      </td>
      <td className="px-4 py-3 text-center">
        {(process.completedCount ?? 0) > 0
          ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">{process.completedCount}</span>
          : <span className="text-gray-300 text-xs">—</span>}
      </td>
      <td className="px-4 py-3 text-center">
        {(process.pausedCount ?? 0) > 0
          ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">{process.pausedCount}</span>
          : <span className="text-gray-300 text-xs">—</span>}
      </td>
      <td className="px-4 py-3 text-center">
        {(process.cancelledCount ?? 0) > 0
          ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">{process.cancelledCount}</span>
          : <span className="text-gray-300 text-xs">—</span>}
      </td>
    </tr>
  );
}

export function MaestroProcessesDashboard() {
  const { sdk, isAuthenticated, logout } = useAuth();
  const maestroProcesses = useMemo(() => new MaestroProcesses(sdk), [sdk]);

  const [processes, setProcesses] = useState<MaestroProcessGetAllResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'faulted' | 'pending'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [page, setPage] = useState(1);

  const fetchProcesses = useCallback(async () => {
    try {
      const result = await maestroProcesses.getAll();
      setProcesses(result);
      setLastRefreshed(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load processes');
    } finally {
      setIsLoading(false);
    }
  }, [maestroProcesses]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProcesses();
    }
  }, [isAuthenticated, fetchProcesses]);

  const folders = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const p of processes) {
      if (p.folderName && !seen.has(p.folderName)) {
        seen.add(p.folderName);
        result.push(p.folderName);
      }
    }
    return result.sort();
  }, [processes]);

  const filtered = useMemo(() => {
    return processes.filter((p) => {
      const matchesSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.packageId?.toLowerCase().includes(search.toLowerCase()) ||
        p.folderName?.toLowerCase().includes(search.toLowerCase());

      const matchesFolder = !folderFilter || p.folderName === folderFilter;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'running' && (p.runningCount ?? 0) > 0) ||
        (statusFilter === 'faulted' && (p.faultedCount ?? 0) > 0) ||
        (statusFilter === 'pending' && (p.pendingCount ?? 0) > 0);

      return matchesSearch && matchesFolder && matchesStatus;
    });
  }, [processes, search, folderFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedProcesses = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFilterChange = useCallback(() => setPage(1), []);

  const stats = useMemo(() => ({
    total: processes.length,
    running: processes.filter((p) => (p.runningCount ?? 0) > 0).length,
    faulted: processes.filter((p) => (p.faultedCount ?? 0) > 0).length,
    folders: new Set(processes.map((p) => p.folderName)).size,
  }), [processes]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-8 h-8 bg-[#FA4616] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-semibold text-gray-900 truncate">Maestro Processes</h1>
              {lastRefreshed && (
                <p className="text-xs text-gray-400 truncate">
                  Updated {lastRefreshed.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { setIsLoading(true); fetchProcesses(); }}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <svg className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-6 space-y-6">
        {/* Stats */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Processes', value: stats.total, color: 'text-gray-900' },
              { label: 'With Running Instances', value: stats.running, color: 'text-blue-600' },
              { label: 'With Faulted Instances', value: stats.faulted, color: 'text-red-600' },
              { label: 'Folders', value: stats.folders, color: 'text-gray-900' },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-48 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search processes…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); handleFilterChange(); }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FA4616]/30 focus:border-[#FA4616]"
            />
          </div>

          <select
            value={folderFilter}
            onChange={(e) => { setFolderFilter(e.target.value); handleFilterChange(); }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FA4616]/30 focus:border-[#FA4616] bg-white"
          >
            <option value="">All folders</option>
            {folders.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          <div className="flex rounded-lg border border-gray-300 overflow-hidden text-sm">
            {(['all', 'running', 'faulted', 'pending'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); handleFilterChange(); }}
                className={`px-3 py-2 capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-[#FA4616] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-[#FA4616] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Table view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M14 3v18" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 transition-colors ${viewMode === 'cards' ? 'bg-[#FA4616] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              title="Card view"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 text-[#FA4616] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-gray-500">Loading Maestro processes…</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg className="w-8 h-8 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-red-800 mb-1">Failed to load processes</p>
            <p className="text-xs text-red-600 mb-3">{error}</p>
            <button
              onClick={fetchProcesses}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium text-gray-600">No processes found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedProcesses.map((p) => (
              <ProcessCard key={p.processKey} process={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">Process / Folder</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Package</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-16">Versions</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20 text-blue-600">Running</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20 text-yellow-600">Pending</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20 text-red-600">Faulted</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24 text-green-600">Completed</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20 text-orange-600">Paused</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Cancelled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedProcesses.map((p, i) => (
                    <ProcessRow key={p.processKey} process={p} index={i} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} processes
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                .reduce<(number | '...')[]>((acc, n, idx, arr) => {
                  if (idx > 0 && typeof arr[idx - 1] === 'number' && (n as number) - (arr[idx - 1] as number) > 1) {
                    acc.push('...');
                  }
                  acc.push(n);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-xs">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item as number)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        currentPage === item
                          ? 'bg-[#FA4616] text-white border border-[#FA4616]'
                          : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}