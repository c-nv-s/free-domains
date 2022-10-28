var regNone = NewRegistrar("none")
var providerCf = DnsProvider(NewDnsProvider("cloudflare"))

var proxyOff = {"cloudflare_proxy": "off"}
var proxyOn = {"cloudflare_proxy": "on"}

var data = require('./../../dns-records.json')

for (var rootDomainName in data) {
  var records = []

  for (var subDomainName in data[rootDomainName]) {
    var proxyState = proxyOn // enabled by default

    if (data[rootDomainName][subDomainName]['proxy'] === false) { // https://stackexchange.github.io/dnscontrol/providers/cloudflare
      proxyState = proxyOff
    }

    var txt = data[rootDomainName][subDomainName]['txt']

    if (txt) {
      for (var _txt in txt) {
        records.push(TXT(subDomainName, txt[_txt])) // https://stackexchange.github.io/dnscontrol/js#TXT
      }
    }

    var cname = data[rootDomainName][subDomainName]['cname']

    if (cname) {
      records.push(CNAME(subDomainName, cname, proxyState)) // https://stackexchange.github.io/dnscontrol/js#CNAME
    }

    var a = data[rootDomainName][subDomainName]['a']

    if (a) {
      for (var _a in a) {
        records.push(A(subDomainName, IP(a[_a]), proxyState)) // https://stackexchange.github.io/dnscontrol/js#A
      }
    }

    var aaaa = data[rootDomainName][subDomainName]['aaaa']

    if (aaaa) {
      for (var _aaaa in aaaa) {
        records.push(AAAA(subDomainName, aaaa[_aaaa], proxyState)) // https://stackexchange.github.io/dnscontrol/js#AAAA
      }
    }
  }

  D(rootDomainName, regNone, providerCf, records)
}
