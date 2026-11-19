<?php
declare(strict_types=1);
require __DIR__ . '/config/conexao.php';

try {
    $filmes = conectar()
        ->query('SELECT id, titulo, descricao, nota, capa, imdb_id, poster_url FROM filmes ORDER BY id DESC')
        ->fetchAll();
} catch (PDOException $e) {
    error_log($e->getMessage());
    responder(false, 'Não foi possível carregar os filmes.', 500);
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($filmes, JSON_UNESCAPED_UNICODE);
