# GET /en/cards/{id}  (uso: .\curl\detalhe-carta.ps1 -Id base1-58)
# API TCGdex: gratuita, sem chave.
param([string]$Id = "base1-58")

$base = "https://api.tcgdex.net/v2/en"

curl.exe -s "$base/cards/$Id"
