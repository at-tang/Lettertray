export const generateId  = async () => {
    /*
    Generates a unique ID. Returns the current number and increment by one
    */
      const { default: Store } = await import('electron-store');
      const store = new Store();
      const idNumber = await store.get("idNumber") || 0;
      const newId = idNumber + 1;

      await store.set("idNumber", newId);
      return idNumber;


}