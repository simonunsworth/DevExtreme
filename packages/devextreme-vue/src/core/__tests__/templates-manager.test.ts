import { VueWrapper } from '@vue/test-utils';
import { discover } from '../templates-discovering';
import { TemplatesManager } from '../templates-manager';

jest.mock('../templates-discovering');

const discoverMock1 = () => ({});
const discoverMock2 = () => ({ template1: jest.fn() });
const discoverMock3 = () => ({ template1: jest.fn(), template2: jest.fn() });

describe('TemplatesManager', () => {
  describe('isDirty', () => {
    it('after init: false', () => {
      (discover as any).mockImplementationOnce(discoverMock1);

      const templatesManager = new TemplatesManager(VueWrapper as any);

      expect(templatesManager.isDirty).toBeFalsy();
    });

    it('after init: true', () => {
      (discover as any).mockImplementationOnce(discoverMock2);

      const templatesManager = new TemplatesManager(VueWrapper as any);

      expect(templatesManager.isDirty).toBeTruthy();
    });

    it('after discover: false (1)', () => {
      (discover as any).mockImplementationOnce(discoverMock1);

      const templatesManager = new TemplatesManager(VueWrapper as any);
      (discover as any).mockImplementationOnce(discoverMock1);
      templatesManager.discover();

      expect(templatesManager.isDirty).toBeFalsy();
    });

    it('after discover: false (2)', () => {
      (discover as any).mockImplementationOnce(discoverMock3);

      const templatesManager = new TemplatesManager(VueWrapper as any);
      templatesManager.resetDirtyFlag();

      (discover as any).mockImplementationOnce(discoverMock3);
      templatesManager.discover();

      expect(templatesManager.isDirty).toBeFalsy();
    });

    it('after discover: true (1)', () => {
      (discover as any).mockImplementationOnce(discoverMock1);

      const templatesManager = new TemplatesManager(VueWrapper as any);
      (discover as any).mockImplementationOnce(discoverMock2);
      templatesManager.discover();

      expect(templatesManager.isDirty).toBeTruthy();
    });

    it('after discover: true (2)', () => {
      (discover as any).mockImplementationOnce(discoverMock2);

      const templatesManager = new TemplatesManager(VueWrapper as any);
      templatesManager.resetDirtyFlag();

      (discover as any).mockImplementationOnce(discoverMock3);
      templatesManager.discover();

      expect(templatesManager.isDirty).toBeTruthy();
    });

    it('after discover: true (3)', () => {
      (discover as any).mockImplementationOnce(discoverMock3);

      const templatesManager = new TemplatesManager(VueWrapper as any);
      templatesManager.resetDirtyFlag();

      (discover as any).mockImplementationOnce(discoverMock2);
      templatesManager.discover();

      expect(templatesManager.isDirty).toBeTruthy();
    });
  });

  describe('resetDirtyFlag', () => {
    it('resets flag value', () => {
      (discover as any).mockImplementationOnce(discoverMock3);

      const templatesManager = new TemplatesManager(VueWrapper as any);
      templatesManager.resetDirtyFlag();

      expect(templatesManager.isDirty).toBeFalsy();
    });
  });

  describe('templates', () => {
    it('returns empty templates', () => {
      (discover as any).mockImplementationOnce(discoverMock1);

      const templatesManager = new TemplatesManager(VueWrapper as any);

      expect(templatesManager.templates).toEqual({});
    });

    it('returns templates', () => {
      (discover as any).mockImplementationOnce(discoverMock3);

      const templatesManager = new TemplatesManager(VueWrapper as any);

      expect(Object.keys(templatesManager.templates)).toEqual(['template1', 'template2']);
    });
  });
});
