{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Foto where

import Import
import Database.Persist
import Database.Persist.Postgresql
import qualified Data.ByteString as BS
import Data.ByteString (ByteString)
import qualified Data.ByteString.Base64 as BS
import qualified Data.Text.Encoding as T
import Data.Aeson
import Prelude (read)


-- cadastra as fotos de determinado anuncio
postFotoR :: OfertaId -> Handler Value
postFotoR ofid = do
  fotosNovas <- requireJsonBody :: Handler [Text] -- recebe assim : '["fwdvwdvv", "vwevwevewv"]'
  _ <- mapM (\photo -> do 
             let dadosFoto = BS.decode (T.encodeUtf8 $ photo)
             case dadosFoto of
                Left _ -> sendStatusJSON internalServerError500 (emptyObject)
                Right dat -> do 
                   foto <- runDB $ insert (Foto ofid)
                   cont <- runDB $ selectList [FotoProposta ==. ofid] []
                   num <- return (length cont)
                   liftIO $ BS.writeFile ("static/img/" ++ (show $ fromSqlKey ofid) ++ "/" ++ (show num)) dat) (map (drop 23) fotosNovas)
  sendStatusJSON created201 (emptyObject)

-- Mostra a quantidade de fotos de um método
getLisFotoR :: OfertaId -> Handler Value
getLisFotoR ofid = do
   _ <- runDB $ get404 ofid
   fotos <- runDB $ selectList [FotoProposta ==. ofid] []
   qtd <- return (length fotos)
   sendStatusJSON ok200 (object ["resp" .= qtd])




                          


  
