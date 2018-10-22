{-# LANGUAGE NoImplicitPrelude #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE MultiParamTypeClasses #-}
{-# LANGUAGE TypeFamilies #-}

module Handler.Municipio where

import Import
import Database.Persist.Postgresql
import Database.Persist

getCidadeR :: Handler Value
getCidadeR = do
   cidades <- runDB $ selectList [] [Asc MunicipioId]
   sendStatusJSON ok200 (object ["resp" .= cidades])  -- retorna o json com as cidades

getEstCidsR :: EstadoId -> Handler Value
getEstCidsR estid = do
   estado <- runDB $ get404 estid
   estadoUf <- return (estadoUf estado) -- o dado vem puro, precisa ser colocado dentro de um conteiner
   cidades <- runDB $ selectList [MunicipioUf ==. estadoUf] []
   sendStatusJSON ok200 (object ["resp" .= cidades])


