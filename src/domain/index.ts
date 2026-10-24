// Exportações públicas da camada L1 Domain
export type { Client, ClientType, ClientStatus } from './client';
export type { Partner, PartnerCategory } from './partner';
export type { Quote, QuoteStatus, QuoteItem, QuoteTerms } from './quote';
export type { Project, ProjectStatus } from './project';
export type { Payment, PaymentStatus, PaymentMethod } from './payment';
export type { Invoice, InvoiceStatus, InvoiceType, ClientFiscal } from './invoice';
export type { Template, TemplateCategory, TemplateItem } from './template';
export type {
  Workflow,
  WorkflowCategory,
  WorkflowStage,
  WorkflowInstance,
  CalendarEvent,
  WorkflowStatus,
} from './workflow';
export {
  initialClients,
  initialPartners,
  initialQuotes,
  initialWorkflows,
  initialWorkflowInstances,
  commercialTerms,
  initialTemplates,
} from './seeds';
export {
  novoWorkflow,
  novoWorkflowStage,
  novoWorkflowInstance,
  proximaEtapa,
  progressoPercentual,
  eventosPorData,
} from './workflow';
