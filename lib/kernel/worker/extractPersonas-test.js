import assert from 'assert';
import { extractPersonaForStatement } from './extractPersonas';

describe('extractPersonaForStatement', () => {
  it('updates statement when identifier already existed', async () => {
    const saved = [];
    const statement = {
      organisation: 'org-1',
      statement: {
        actor: {
          name: 'Ada',
          mbox: 'mailto:ada@example.com',
        },
      },
      save: async function save() {
        saved.push({
          personaIdentifier: this.personaIdentifier,
          person: this.person,
        });
      },
    };

    const personaService = {
      createUpdateIdentifierPersona: async () => ({
        personaId: 'persona-1',
        identifierId: 'ident-1',
        wasCreated: false,
      }),
      getPersona: async () => ({
        persona: { name: 'Ada Lovelace' },
      }),
    };

    await extractPersonaForStatement(personaService)(statement);

    assert.strictEqual(saved.length, 1);
    assert.strictEqual(saved[0].personaIdentifier, 'ident-1');
    assert.deepStrictEqual(saved[0].person, {
      _id: 'persona-1',
      display: 'Ada Lovelace',
    });
  });

  it('assigns identifier across statements when newly created', async () => {
    let saved = false;
    const assignCalls = [];
    const statement = {
      organisation: { toString: () => 'org-1' },
      statement: {
        actor: {
          mbox: 'mailto:new@example.com',
        },
      },
      save: async () => {
        saved = true;
      },
    };

    const personaService = {
      createUpdateIdentifierPersona: async () => ({
        personaId: 'persona-2',
        identifierId: 'ident-2',
        wasCreated: true,
      }),
      getPersona: async () => ({
        persona: { name: 'New Person' },
      }),
    };

    await extractPersonaForStatement(personaService, {
      asignIdentifierToStatements: async (args) => {
        assignCalls.push(args);
      },
    })(statement);

    assert.strictEqual(saved, false);
    assert.deepStrictEqual(assignCalls, [{
      organisation: 'org-1',
      toIdentifierId: 'ident-2',
    }]);
  });
});
