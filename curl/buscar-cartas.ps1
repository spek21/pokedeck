# GET /en/cards?name=...  (uso: .\curl\buscar-cartas.ps1 -Nome pikachu)
# API TCGdex: gratuita, sem chave. O nome é buscado "contendo" o texto.
param([string]$Nome = "pikachu")

$base = "https://api.tcgdex.net/v2/en"

curl.exe -s -G "$base/cards" `
  --data-urlencode "name=$Nome" `
  "-d" "pagination:page=1" `
  "-d" "pagination:itemsPerPage=20"
