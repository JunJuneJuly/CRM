export {}
interface Dicts{
  [key:string]:any;
}
declare module 'vue'{
  interface ComponentCustomProperties{
    dicts:Dicts
  }
}