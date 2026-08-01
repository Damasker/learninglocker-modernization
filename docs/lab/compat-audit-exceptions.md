# Compat audit — exceptions (no inline marker)

Files that **cannot** hold `@ll-compat-audit` comments. Tracked here instead
(plan 1A exception).

## Extension rules

No inline marker required; must appear in the inventory below (or be covered by
a NEW prefix):

| Ext | Reason |
|-----|--------|
| `.json` | No comments |
| `.yml` / `.yaml` | Prefer inventory (YAML `#` possible but inventory keeps one rule) |
| `.lock` | Generated |
| `.png` `.gif` `.ico` `.svg` `.woff` `.woff2` `.eot` `.ttf` | Binary / asset |
| `.csv` `.snap` `.dist` | Fixtures / generated / dist templates |
| `.overlay` `.legacy-restify` `.modern-native-get` | Env fragment (listed) |
| `.nvmrc` `.yarnrc` `.eslintignore` `.editorconfig` `.gitattributes` `.gitkeep` | Dotfiles without comment grammar used here |
| `.babelrc` `.eslintrc` | JSON-like / listed |
| `(none)` / odd extensions | Listed explicitly |

## Marker-capable extensions (must use inline marker unless NEW)

`.js` `.jsx` `.ts` `.tsx` `.sh` `.md` `.css` `.html` `.babel` (as JS-like)

## Inventory

Generated/updated by `node lab/scripts/compat-audit-sync-exceptions.js`.
Status: `ok` | `adapt:<id>` | `skip:<reason>`.

<!-- BEGIN_INVENTORY -->
| Path | Status |
|------|--------|
| `.babelrc` | ok |
| `.circleci/config.yml` | ok |
| `.commitlintrc.json` | ok |
| `.editorconfig` | ok |
| `.env.example` | ok |
| `.eslintignore` | ok |
| `.eslintrc` | ok |
| `.gitignore` | ok |
| `.nvmrc` | adapt:A005 |
| `.yarnrc` | ok |
| `api/.gitignore` | ok |
| `api/src/downloads/.gitignore` | ok |
| `api/src/downloads/.gitkeep` | ok |
| `api/src/routes/tests/fixtures/.gitignore` | ok |
| `api/src/routes/tests/fixtures/favicon.png` | ok |
| `api/src/routes/tests/fixtures/people.csv` | ok |
| `api/storage/downloads/.gitignore` | ok |
| `api/storage/logos/.gitignore` | ok |
| `api/storage/tmp/.gitignore` | ok |
| `jsconfig.json` | ok |
| `lib/helpers/tests/__fixtures__/testStatement.json` | ok |
| `lib/services/importPersonas/__fixtures__/bigsimpleImport.csv` | ok |
| `lib/services/importPersonas/__fixtures__/duplicateHeadings.csv` | ok |
| `lib/services/importPersonas/__fixtures__/firstNameAndLastNameImport.csv` | ok |
| `lib/services/importPersonas/__fixtures__/invalidSimpleImport.csv` | ok |
| `lib/services/importPersonas/__fixtures__/mediumsimpleImport.csv` | ok |
| `lib/services/importPersonas/__fixtures__/simpleAccount.csv` | ok |
| `lib/services/importPersonas/__fixtures__/simpleImport.csv` | ok |
| `lib/services/importPersonas/__fixtures__/simpleImport2.csv` | ok |
| `lib/services/importPersonas/__fixtures__/simpleImport2withAttributes.csv` | ok |
| `lib/services/importPersonas/__fixtures__/simpleImport3.csv` | ok |
| `lib/services/importPersonas/__fixtures__/test.csv` | ok |
| `lib/services/importPersonas/__fixtures__/testempty.csv` | ok |
| `logos/561a679c0c5d017e4004714f` | ok |
| `logs/.gitignore` | ok |
| `nginx.conf.example` | ok |
| `package.json` | adapt:A001 |
| `pm2/all.json` | ok |
| `pm2/all.json.dist` | ok |
| `pm2/core.json` | ok |
| `pm2/dev-all.json` | ok |
| `pm2/server.json` | ok |
| `pm2/test-all.json` | ok |
| `pm2/ui.json` | ok |
| `pm2/webapp.json.dist` | ok |
| `pm2/worker.json` | ok |
| `pm2/worker.json.dist` | ok |
| `storage/downloads/.gitignore` | ok |
| `storage/logos/.gitignore` | ok |
| `storage/statements/.gitignore` | ok |
| `storage/storage/logos/561a679c0c5d017e4004714f` | ok |
| `storage/tests/.gitignore` | ok |
| `storage/tests/exportDownload.csv` | ok |
| `storage/tmp/.gitignore` | ok |
| `ui/.gitignore` | ok |
| `ui/jest.config.json` | ok |
| `ui/src/assets/background.png` | ok |
| `ui/src/assets/geometric-pattern.png` | ok |
| `ui/src/components/AutoComplete2/Inputs/SingleInput/.gitignore` | ok |
| `ui/src/components/AutoComplete2/Inputs/SingleInput/__snapshots__/SingleInput.spec.js.snap` | ok |
| `ui/src/components/Charts/__snapshots__/BarChart.spec.js.snap` | ok |
| `ui/src/components/Charts/__snapshots__/ColumnChart.spec.js.snap` | ok |
| `ui/src/components/Charts/__snapshots__/LineChart.spec.js.snap` | ok |
| `ui/src/components/Charts/__snapshots__/PieChart.spec.js.snap` | ok |
| `ui/src/components/NotFound/__snapshots__/NotFound.spec.js.snap` | ok |
| `ui/src/components/SideNavFooter/__snapshots__/sidenavfooter.spec.js.snap` | ok |
| `ui/src/components/TableInput/__snapshots__/TableInput.spec.js.snap` | ok |
| `ui/src/components/VisualiseIcon/__snapshots__/VisualiseIcon.spec.js.snap` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-accumulation-grey.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-accumulation.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-bar-graph-grey.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-bar-graph.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-column-and-frequency-grey.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-column-graph-grey.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-column-graph.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-correlation-grey.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-correlation.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-counter-grey.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-counter.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-frequency-grey.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-frequency.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-pie-chart-grey.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-pie-chart.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-table-and-statement-grey.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-table-grey.svg` | ok |
| `ui/src/components/VisualiseIcon/assets/ll-icon-table.svg` | ok |
| `ui/src/containers/BasicQueryBuilder/Boolean/__snapshots__/Criterion.spec.js.snap` | ok |
| `ui/src/containers/BasicQueryBuilder/Continuous/__snapshots__/Criterion.spec.js.snap` | ok |
| `ui/src/containers/BasicQueryBuilder/Range/__snapshots__/Criterion.spec.js.snap` | ok |
| `ui/src/containers/DashboardCard/assets/blank-dashboard.png` | ok |
| `ui/src/containers/DashboardCard/assets/getting-started.png` | ok |
| `ui/src/containers/DashboardCard/assets/private.png` | ok |
| `ui/src/containers/DashboardCard/assets/stream-starter.png` | ok |
| `ui/src/containers/DashboardTemplates/assets/blank-dashboard.png` | ok |
| `ui/src/containers/DashboardTemplates/assets/getting-started.png` | ok |
| `ui/src/containers/DashboardTemplates/assets/stream-starter.png` | ok |
| `ui/src/containers/SaveBar/__snapshots__/SaveBar.spec.js.snap` | ok |
| `ui/src/containers/SaveBarErrors/__snapshots__/SaveBarErrors.spec.js.snap` | ok |
| `ui/src/containers/VisualiseResults/__snapshots__/SourceResults.spec.js.snap` | ok |
| `ui/src/pages/HomePage/logo.png` | ok |
| `ui/src/pages/PeopleImportPage/__snapshots__/PersonasImportForm.spec.js.snap` | ok |
| `ui/src/pages/PeopleImportPage/__snapshots__/PersonasImports.spec.js.snap` | ok |
| `ui/src/pages/PeopleImportPage/__snapshots__/PersonasImportsComponent.spec.js.snap` | ok |
| `ui/src/pages/PeopleImportPage/stages/__snapshots__/ConfigureUpload.spec.js.snap` | ok |
| `ui/src/pages/PeopleImportPage/stages/__snapshots__/InitialUpload.spec.js.snap` | ok |
| `ui/src/pages/SettingsAppsPage/icons/biConnector.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/cornerstoneOnDemand.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/csvToXAPI.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/degreed.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/gdpr.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/getAbstract.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/googleForms.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/launchr.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/moodle.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/moodle@2x.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/salesDemo.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/semanticAnalysis.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/skillsoft.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/sparks.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/sparks@2x.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/stream.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/stream@2x.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/surveyMonkey.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/urlShortener.png` | ok |
| `ui/src/pages/SettingsAppsPage/icons/yammer.png` | ok |
| `ui/src/pages/SettingsClientsPage/__tests__/__snapshots__/ClientForm.spec.js.snap` | ok |
| `ui/src/static/favicon.ico` | ok |
| `ui/src/static/favicon.png` | ok |
| `ui/src/static/fonts/glyphicons-halflings-regular.eot` | ok |
| `ui/src/static/fonts/glyphicons-halflings-regular.svg` | ok |
| `ui/src/static/fonts/glyphicons-halflings-regular.ttf` | ok |
| `ui/src/static/fonts/glyphicons-halflings-regular.woff` | ok |
| `ui/src/static/fonts/glyphicons-halflings-regular.woff2` | ok |
| `ui/src/static/fonts/ionicons.eot` | ok |
| `ui/src/static/fonts/ionicons.svg` | ok |
| `ui/src/static/fonts/ionicons.ttf` | ok |
| `ui/src/static/fonts/ionicons.woff` | ok |
| `ui/src/static/fonts/material.woff2` | ok |
| `ui/src/static/logo.png` | ok |
| `ui/src/static/logos/default/default.gif` | ok |
| `ui/src/static/register-logo.png` | ok |
| `ui/src/static/smallLogo.png` | ok |
| `ui/src/static/whiteLogo.png` | ok |
| `ui/src/utils/__snapshots__/defaultTitles.spec.js.snap` | ok |
| `ui/src/utils/assets/ll-chevron-down-icon.svg` | ok |
| `ui/src/utils/assets/ll-chevron-up-icon.svg` | ok |
| `yarn.lock` | ok |

_Count: 147_
<!-- END_INVENTORY -->
