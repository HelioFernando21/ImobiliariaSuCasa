{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Oferta where

import Import
import Database.Persist
import Database.Persist.TH
import Database.Persist.Postgresql
import System.Directory
import Data.Aeson
import Prelude (read)

-- cadastra uma oferta
postOfertaR :: UsuarioId -> Handler Value
postOfertaR uid = do
         oferta <- requireJsonBody :: Handler Oferta
         ofid <- runDB $ insert oferta
         _ <- runDB $ update ofid [OfertaAnunciante =. uid]
         liftIO $ createDirectory $ "static/img/"++ (show (fromSqlKey ofid))
         sendStatusJSON created201 (object ["resp" .= fromSqlKey ofid])    
   
-- busca todas as ofertas com uma foto
getHomeR :: Handler Value
getHomeR = do
         let anunciosporpagina = 5
         anuncios <- runDB $ selectList [] [Desc OfertaDia
                                     , LimitTo anunciosporpagina
                                     , OffsetBy 0
                                     ]
         fotos <- runDB $ selectList [] [Asc FotoId]
         sendStatusJSON ok200 (object ["resp" .= pegaUmaFoto anuncios fotos])

pegaOfertaId :: (Entity Oferta) -> Key Oferta
pegaOfertaId (Entity usuid _) = usuid

pegaFotoPropId :: (Entity Foto) -> Key Oferta
pegaFotoPropId (Entity _ (Foto propid)) = propid

joinn :: (Entity Oferta) -> [Entity Foto] -> (Entity Oferta, [Entity Foto])
joinn ep lef = do
    (ep, (filter(\ef -> pegaOfertaId(ep) == pegaFotoPropId(ef)) lef))

junta :: [Entity Oferta] -> [Entity Foto] -> [(Entity Oferta, [Entity Foto])]
junta lep lef = do
  map (\ep -> joinn ep lef) lep

 -- busca todas as ofertas com fotos
getOfertaComFoto :: Handler Value
getOfertaComFoto = do
         anuncios <- runDB $ selectList [] [Asc OfertaId] 
   	 fotos <- runDB $ selectList [] [Desc FotoProposta]
   	 sendStatusJSON ok200 (object ["resp" .= junta anuncios fotos])
 

-- recupera uma oferta específica com telefone do anunciante
getEspOfertaR :: OfertaId -> Handler Value
getEspOfertaR ofid = do
         oferta <- runDB $ get404 ofid
         anunid <- return (ofertaAnunciante oferta)
         anunciante <- runDB $ get404 anunid
         telefone <- return (usuarioTelefone anunciante)
         sendStatusJSON ok200 (object ["resp" .= oferta, "telefone" .= telefone])

-- altera os dados de uma oferta
putCrudR :: OfertaId -> UsuarioId -> Handler Value
putCrudR ofid _ = do
         _ <- runDB $ get404 ofid
         ofertaNova <- requireJsonBody
         runDB $ replace ofid ofertaNova
         sendStatusJSON ok200 (object ["resp" .= (String "success")])

-- deleta uma oferta
deleteCrudR :: OfertaId -> UsuarioId -> Handler Value
deleteCrudR ofid _ = do
         _ <- runDB $ get404 ofid
         runDB $ delete ofid
         sendStatusJSON ok200 (object ["resp" .= (String "success")])

-- recupera as ofertas/anuncios de determinado usuario (resumido, não finalizado)
getMAnuncioR :: UsuarioId -> Handler Value
getMAnuncioR uid = do
   _ <- runDB $ get404 uid
   anuncios <- runDB $ selectList [OfertaAnunciante ==. uid] []
   sendStatusJSON ok200 (object ["resp" .= anuncios])



joinnn :: (Entity Oferta) -> [Entity Foto] -> (Entity Oferta, [Entity Foto])
joinnn ep lef = 
    (ep, take 1 (filter(\ef -> pegaOfertaId(ep) == pegaFotoPropId(ef)) lef))

pegaUmaFoto :: [Entity Oferta] -> [Entity Foto] -> [(Entity Oferta, [Entity Foto])]
pegaUmaFoto lof lfot = 
    (map (\ ofer -> joinnn ofer lfot) lof)


data Busca = Busca {
   tipoproposta :: Text,
   tipomoradia :: Text,
   preco :: Text,
   espaco :: Text,
   numeroquartos :: Text,
   vagasestacionamento :: Text,
   cidade :: Text,
   estado :: Text
}

instance FromJSON Busca where
    parseJSON = withObject "Busca" $ \v -> Busca
        <$> v .: "tipoproposta"
        <*> v .: "tipomoradia"
        <*> v .: "preco"
	<*> v .: "espaco"
	<*> v .: "numeroquartos"
	<*> v .: "vagasestacionamento"
	<*> v .: "cidade"
	<*> v .: "estado"

postBuscR :: Int -> Handler Value
postBuscR pageNumber = do
   busca <- requireJsonBody :: Handler Busca
   let anunciosporpagina = 5
   anuncios <- runDB $ selectList [OfertaTipoproposta ==. tipoproposta busca, OfertaTipomoradia ==. tipomoradia busca, OfertaValor <=. (read $ unpack $ preco busca), OfertaEspaco >=. (read $ unpack $ espaco busca), OfertaNumeroquartos >=. numeroquartos busca, OfertaVagasestacionamento >=. vagasestacionamento busca, OfertaCidade ==. cidade busca, OfertaEstado ==. estado busca] [Desc OfertaDia, LimitTo anunciosporpagina, OffsetBy $ (pageNumber - 1) * anunciosporpagina]
   fotos <- runDB $ selectList [] [Desc FotoId]
   sendStatusJSON ok200 (object ["resp" .= pegaUmaFoto anuncios fotos])


                          


  
