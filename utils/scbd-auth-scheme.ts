import type { AuthUser } from '../types/scbd-auth-user';
import type { AuthToken } from "../types/scbd-auth-token";

const FrameName = 'scbdAuthFrame';

export async function initAuhtIFrame() : Promise<HTMLIFrameElement> {
  
  let existingIFrame = document.querySelector(`iframe[name=${FrameName}]`) as HTMLIFrameElement;

  if(existingIFrame) return existingIFrame;

  const config = useScbdAuthConfig();

  return new Promise<HTMLIFrameElement>((resolve, reject)=>{

    const timer = setTimeout(() => {
      console.debug("Auth", "frame init timed-out")
      reject(new Error('Loading authentication timed-out'));
    }, 5000);

    const iFrame = document.createElement("iframe") as HTMLIFrameElement;
    
    iFrame.setAttribute("src", toValue(config.iframeUrl));
    iFrame.setAttribute("name", FrameName);
    iFrame.setAttribute("style", "display:none;");
    iFrame.onload = () => { 
      clearTimeout(timer);
      resolve(iFrame) 
    }

    document.body.appendChild(iFrame);
  });
}
  
// ===========================
//
// ===========================
export async function sendMessage(iFrame:HTMLIFrameElement, type:string, data:object) : Promise<any> {

  const { origin } = new URL(iFrame.getAttribute('src') || '');
  const retEvent = await new Promise<MessageEvent>((resolve, reject)=>{

    let timeoutTimer: any = 0;
    let receiveMessage = (e: MessageEvent) => {}

    const cleanup = () => {
      if(timeoutTimer) clearTimeout(timeoutTimer);
      window.removeEventListener('message', receiveMessage);
    }

    timeoutTimer = setTimeout(() => {
      cleanup();
      reject(new Error(`postMessage timed out`));
    }, 1000);

    receiveMessage = (e: MessageEvent) => {
      if(e.origin !== origin) return; // not for us;
      cleanup();
      resolve(e);
    }    

    window.addEventListener('message', receiveMessage);

    const { contentWindow } = iFrame;
    const message = { ...data, type };

    contentWindow?.postMessage(JSON.stringify(message), origin);
  });

  const retMessage = JSON.parse(retEvent.data);

  return retMessage;
}

// ===========================
//
// ===========================
export async function getToken(iFrame:HTMLIFrameElement) : Promise<AuthToken|null> {

  const { type, ...data } = await sendMessage(iFrame, "getAuthenticationToken", {});

  if(type!=="authenticationToken") throw new Error("getAuthenticationToken: invalid response");

  const { authenticationToken, expiration } = data;

  if(!authenticationToken) return null;

  return {
    authenticationToken : `Bearer ${authenticationToken}`,
    expiration: new Date(expiration)
  };
}

// ===========================
//
// ===========================
export async function getUser(token: Ref<string|null>|string|null) : Promise<AuthUser> {

  const { currenUserUrl } = useScbdAuthConfig();
  const headers = new Headers();

  if(toValue(token)) headers.append('Authorization', toValue(token)||'');

  const response = await useFetch<AuthUser>(toValue(currenUserUrl), { headers });

  return response.data.value as AuthUser;
}
  