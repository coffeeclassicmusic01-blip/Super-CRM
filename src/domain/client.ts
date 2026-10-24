/**
 * Entidade Cliente (Módulo 5: CRM & Gestão de Clientes).
 * Pessoa Física ou Jurídica, com contatos, endereços e campos customizados.
 */

export type ClientType = 'PF' | 'PJ';

export type ClientStatus = 'ativo' | 'inativo' | 'prospecto' | 'bloqueado';

export type ClientAddress = {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  uf: string;
  pais?: string;
};

export type ClientContact = {
  nome: string;
  cargo?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  principal: boolean;
};

export type ClientCustomField = {
  chave: string;
  valor: string;
  tipo: 'texto' | 'numero' | 'data' | 'booleano';
};

export type Client = {
  id: string;
  tipo: ClientType;
  nome: string;
  nomeFantasia?: string;
  cpfCnpj: string;
  ie?: string; // Inscrição Estadual (PJ)
  im?: string; // Inscrição Municipal (PJ)
  status: ClientStatus;
  contato?: string;
  email?: string;
  telefone?: string;
  endereco?: ClientAddress;
  contatos: ClientContact[];
  camposCustomizados: ClientCustomField[];
  notas: string[];
  cor: string;
  iniciales: string;
  criadoEm: string;
  atualizadoEm: string;
  versao: number;
};

export function novoClient(
  id: string,
  tipo: ClientType,
  nome: string,
  cpfCnpj: string,
): Client {
  const agora = new Date().toISOString();
  return {
    id,
    tipo,
    nome,
    cpfCnpj,
    status: 'prospecto',
    contatos: [],
    camposCustomizados: [],
    notas: [],
    cor: 'slate',
    iniciales: nome
      .split(' ')
      .map((p) => p[0]?.toUpperCase())
      .filter(Boolean)
      .join(''),
    criadoEm: agora,
    atualizadoEm: agora,
    versao: 1,
  };
}

export function clientDisplayName(c: Client): string {
  return c.nomeFantasia ? `${c.nome} (${c.nomeFantasia})` : c.nome;
}
