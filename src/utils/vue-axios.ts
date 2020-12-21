import { AxiosInstance, AxiosResponse } from "axios"
import { ref, Ref } from "vue"

interface FactoryConfig<T> {
  instance: AxiosInstance;
  createItem: () => T;
}

interface buildUseGetConfig<T> {
  path: string;
  itemRef?: Ref<T>;
}

interface buildUseGetReturn<T> {
  fetch: () => Promise<AxiosResponse<T>>;
  item: Ref<T>
}

interface buildUsePostReturn<T> {
  handler: () => Promise<AxiosResponse<T>>
}

export const buildUseFactory = <T>(globalConfig: FactoryConfig<T>) => {
  const buildUseGet = (config: buildUseGetConfig<T>) => (): buildUseGetReturn<T> => {
    let item: Ref<T>;
    if(config.itemRef){
      item = config.itemRef;
    } else {
      item = ref(globalConfig.createItem()) as Ref<T>
    }
    

    const fetch = () => globalConfig.instance
      .get(config.path)
      .then(res => {
        item.value = res.data
        return res
      })
    
    return {
      item,
      fetch
    }
  }

  const buildUsePost = (path: string) => (dataRef: Ref<T>): buildUsePostReturn<T> => {
    const handler = () => globalConfig.instance
      .post(path,dataRef.value)
    return {
      handler
    }
  }

  return {
    buildUseGet,
    buildUsePost
  }
}