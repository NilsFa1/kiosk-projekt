export interface Benutzer {
  id: number;
  name: string;
  password: string;
  isAdmin: boolean;
  openApiToken?: string;
  openApiUrl?: string;
}

export interface BenutzerSmall extends Omit<Benutzer, 'password'> {
}

export interface LoginRequestParams {
  name: string;
  password: string;
}

export interface AnalyzeRequestParams {
  fileUrls: string[];
  type: string;
}

export interface AnalyzeResponse {
  products: {
    name: string;
    price: number;
    category: string;
    description: string;
    imageDescription: string;
  }[]
}

export interface AnalyzeResponseWithImages {
  products: {
    name: string;
    price: number;
    category: string;
    description: string;
    image: Blob
  }[]
}

export interface UpdateUserRequestParams extends Pick<Benutzer, 'openApiToken' | 'openApiUrl' | 'id'> {
}
