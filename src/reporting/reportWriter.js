/**
 * Re-export v1 logger/report functions for v2 module layout.
 */
import { writeFileSync } from 'node:fs';
import { log, writeReport } from '../logger.js';

export { log, writeReport };

/**
 * ReportWriter — thin wrapper around the v1 writeReport function
 * that supports multiple output formats.
 */
export class ReportWriter {
  constructor(options = {}) {
    this.reportPath = options.reportPath || 'stress-test-report.txt';
    this.format = options.format || 'txt';
  }

  /**
   * Generate and write a report.
   * @param {object} config - test configuration
   * @param {object} summary - metrics summary
   * @returns {string} the report content
   */
  write(config, summary) {
    if (this.format === 'json') {
      return this._writeJson(config, summary);
    }
    if (this.format === 'html') {
      return this._writeHtml(config, summary);
    }
    return this._writeTxt(config, summary);
  }

  _writeTxt(config, summary) {
    return writeReport(config, summary, this.reportPath);
  }

  _writeJson(config, summary) {
    const report = JSON.stringify({ config, summary }, null, 2);
    try {
      writeFileSync(this.reportPath, report);
    } catch (err) {
      process.stderr.write(`Failed to write JSON report: ${err.message}\n`);
    }
    return report;
  }

  _writeHtml(config, summary) {
    const html = `<!DOCTYPE html>
<html><head><title>Stress Test Report</title></head>
<body>
<h1>API Stress Test Report</h1>
<table>
${Object.entries(summary).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('\n')}
</table>
</body></html>`;
    try {
      writeFileSync(this.reportPath, html);
    } catch (err) {
      process.stderr.write(`Failed to write HTML report: ${err.message}\n`);
    }
    return html;
  }
}
