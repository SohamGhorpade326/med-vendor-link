import { Response } from 'express';
import { SalesReport } from '../models/SalesReport.model';
import { Vendor } from '../models/Vendor.model';
import { AuthRequest } from '../middleware/auth.middleware';

export class SalesReportController {
  async generateReport(req: AuthRequest, res: Response) {
    try {
      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      const { reportType, startDate, endDate } = req.body;

      const report = new SalesReport({
        vendorId: vendor._id,
        reportType,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      });

      await report.generate();

      res.status(201).json({
        message: 'Report generated successfully',
        report
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReports(req: AuthRequest, res: Response) {
    try {
      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      const { reportType } = req.query;
      const filter: any = { vendorId: vendor._id };

      if (reportType) {
        filter.reportType = reportType;
      }

      const reports = await SalesReport.find(filter)
        .sort({ startDate: -1 });

      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getReportById(req: AuthRequest, res: Response) {
    try {
      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor profile not found' });
      }

      const report = await SalesReport.findOne({
        _id: req.params.id,
        vendorId: vendor._id
      });

      if (!report) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
