import { getPagination, paginatedResponse } from '../../../utils/pagination.js';
import { writeAuditLog } from '../../audit/services/audit.service.js';
import { ContentReport } from '../models/contentReport.model.js';
export const createReport = async (reporter, payload, req) => { const report = await ContentReport.create({ ...payload, reporter }); await writeAuditLog({ actor: reporter, action: 'report.create', entityType: 'ContentReport', entityId: report._id, req }); return report; };
export const listReports = async (query) => { const { page, limit, skip } = getPagination(query); const filter = query.status ? { status: query.status } : {}; const [items,total]=await Promise.all([ContentReport.find(filter).sort({createdAt:-1}).skip(skip).limit(limit).populate('reporter','name username role'), ContentReport.countDocuments(filter)]); return paginatedResponse(items,total,page,limit); };
