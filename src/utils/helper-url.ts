export function extractDomain(str: string){
    const domainRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)/;
    const match = str.match(domainRegex);
    
    if (match) {
      return match[1];
    } else {
      return null;
    }
  }
  