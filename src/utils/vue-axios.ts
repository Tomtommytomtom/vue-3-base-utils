import { AxiosInstance, AxiosResponse } from "axios"
import { ref, Ref } from "vue"

interface FactoryConfig<T> {
  instance: AxiosInstance;
  createItem: () => T;
}

interface buildUseGetReturn<T> {
  fetch: () => Promise<AxiosResponse<T>>;
  item: Ref<T>
}

interface buildUsePostReturn<T> {
  handler: () => Promise<AxiosResponse<T>>
}

export const buildUseFactory = <T>(config: FactoryConfig<T>) => {
  const buildUseGet = (path: string): buildUseGetReturn<T> => {
    const item = ref(config.createItem()) as Ref<T>

    const fetch = () => config.instance
      .get(path)
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
    const handler = () => config.instance
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