import { AutomationRequest, Rule } from '../../api/types';

export const mainCreateNewRule = async (r: Rule) => {
      const { default: Store } = await import('electron-store');
      const store = new Store();
    
      const arr = (store.get('rules') as typeof r[] | undefined) ?? [];
      let newArr = arr.concat([r]);
      store.set("rules", newArr);

      return r;

}