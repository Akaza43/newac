interface DomainConfig {
  hostname: string;
  url: string;
  openInNewTab: boolean;
}

export const domainConfigs: DomainConfig[] = [
  {
    hostname: '',
    url: 'https:/www.sektecrypto.my.id/',
    openInNewTab: true
  },
  {
    hostname: 'app.sektecrypto.my.id',
    url: 'https:/www.sektecrypto.my.id/',
    openInNewTab: true
  },
];

export const getKomunitasLink = () => {
  if (typeof window !== 'undefined') {
    const config = domainConfigs.find(d => d.hostname === window.location.hostname);
    return config?.url || '/menu/komunitas';
  }
  return '/menu/komunitas';
};

export const navigationLinks = {
  home: "/",
  research: "/menu/research",
  news: "menu/news", // Pastikan ini ada
  komunitas: getKomunitasLink(),
};
