import fs from 'fs';
import path from 'path';

interface CoverageData {
  statements: { total: number; covered: number; };
  branches: { total: number; covered: number; };
  functions: { total: number; covered: number; };
  files: string[];
  packages: Record<string, { total: number; covered: number; }>;
}

function updateReadmeStats(coverageData: CoverageData) {
  const readmePath = path.join(process.cwd(), 'README.md');
  let readme = fs.readFileSync(readmePath, 'utf-8');

  // Calculate percentages
  const statementsPercentage = (coverageData.statements.covered / coverageData.statements.total * 100).toFixed(1);
  const branchesPercentage = (coverageData.branches.covered / coverageData.branches.total * 100).toFixed(1);
  const functionsPercentage = (coverageData.functions.covered / coverageData.functions.total * 100).toFixed(1);

  // Update coverage table
  const coverageSection = `| Category | Coverage | Details |
|----------|----------|---------|
| Statements | ${statementsPercentage}% (${coverageData.statements.covered}/${coverageData.statements.total}) | Core functionality coverage |
| Conditionals | ${branchesPercentage}% (${coverageData.branches.covered}/${coverageData.branches.total}) | Branch logic coverage |
| Methods | ${functionsPercentage}% (${coverageData.functions.covered}/${coverageData.functions.total}) | Function coverage |
| Files | ${coverageData.files.length} files | Across ${Object.keys(coverageData.packages).length} packages |`;

  // Create package coverage section
  const packageRows = Object.entries(coverageData.packages).map(([pkg, stats]) => {
    const percentage = (stats.covered / stats.total * 100).toFixed(1);
    const icon = percentage === '100' ? '✅' : percentage === '0' ? '❌' : '🟨';
    return `- ${icon} \`${pkg}\`: ${percentage}% (${stats.covered}/${stats.total} statements)`;
  }).join('\n');

  // Replace the existing coverage sections
  const coverageTableRegex = /\| Category \| Coverage \| Details \|[\s\S]*?\| Files \|.*\|/;
  const packageCoverageRegex = /##### Coverage by Package[\s\S]*?(?=\n\n)/;

  readme = readme.replace(coverageTableRegex, coverageSection);
  readme = readme.replace(packageCoverageRegex, `##### Coverage by Package\n\n${packageRows}`);

  fs.writeFileSync(readmePath, readme);
  console.log('README.md has been updated with the latest test coverage statistics.');
}

// This function will be called by Vitest after coverage is generated
export function processCoverageResults(coverageResults: any) {
  const coverageData: CoverageData = {
    statements: { total: 0, covered: 0 },
    branches: { total: 0, covered: 0 },
    functions: { total: 0, covered: 0 },
    files: [],
    packages: {}
  };

  // Process total coverage
  const total = coverageResults.total;
  coverageData.statements = {
    total: total.statements.total,
    covered: total.statements.covered
  };
  coverageData.branches = {
    total: total.branches.total,
    covered: total.branches.covered
  };
  coverageData.functions = {
    total: total.functions.total,
    covered: total.functions.covered
  };

  // Process files and package coverage
  for (const [filePath, fileData] of Object.entries(coverageResults)) {
    if (filePath === 'total') continue;

    coverageData.files.push(filePath);

    // Extract package name from file path
    const packageMatch = filePath.match(/src\/(.+?)\//);
    if (packageMatch) {
      const packageName = packageMatch[1];
      if (!coverageData.packages[packageName]) {
        coverageData.packages[packageName] = { total: 0, covered: 0 };
      }

      const pkg = coverageData.packages[packageName];
      const fileStats = (fileData as any).statements;
      pkg.total += fileStats.total;
      pkg.covered += fileStats.covered;
    }
  }

  updateReadmeStats(coverageData);
} 