/**
 * Attachment streaming helpers used by statement forwarding.
 * Deep package paths stay here so worker call sites stay stable.
 */
export { default as getAttachments } from '@learninglocker/xapi-statements/dist/service/utils/getAttachments';
export {
  default as streamStatementsWithAttachments,
  boundary,
} from '@learninglocker/xapi-statements/dist/expressPresenter/utils/getStatements/streamStatementsWithAttachments';

// Default export matches previous getAttachments default import.
export { default } from '@learninglocker/xapi-statements/dist/service/utils/getAttachments';
