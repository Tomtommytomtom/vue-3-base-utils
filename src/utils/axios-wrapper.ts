import axios,{ AxiosRequestConfig, AxiosInstance, AxiosTransformer, AxiosResponse } from "axios"

interface InstanceConfig {
  axiosConfig?: AxiosRequestConfig;
}

export class AxiosWrapper {
  axiosConfig: AxiosRequestConfig;
  protected axiosInstance: AxiosInstance;

  constructor({ axiosConfig }:InstanceConfig){
    this.axiosConfig = axiosConfig || {}
    this.axiosInstance = axios.create()
  }

  public create() {
    this.axiosInstance = axios.create(this.axiosConfig)
    return this.axiosInstance
  }
  
}

interface TokenConfig extends InstanceConfig{
  tokenDataPath?: string[]
}

export class TokenAxiosWrapper extends AxiosWrapper {
  public token: string;
  public tokenDataPath: string[];
  constructor(config: TokenConfig){
    super(config)
    this.token = ''
    this.tokenDataPath = config.tokenDataPath || ['accessToken']
  }

  private addAuthBearerHeader = (config: AxiosRequestConfig) => {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${this.token || ''}`
      }
    }
  }

  private retreiveToken = (res: AxiosResponse) => {
    const accessToken = this.tokenDataPath.reduce((acc: any, curr:string) => {
      return acc[curr]
    }, res.data)

    if(accessToken){
      this.token = accessToken
    }
    return res
  }

  public create(){
    super.create()
    this.axiosInstance.interceptors.request.use(this.addAuthBearerHeader)
    this.axiosInstance.interceptors.response.use(this.retreiveToken)
    return this.axiosInstance
  }

  public clearToken(){
    this.token = ''
  }
}




