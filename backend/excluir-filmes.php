<?php
    declare(strict_types=1);
    require __DIR__ . '/config/conexao.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        responder(false, 'Método não permitido.', 405);
    }

    $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($id === false || $id === null) {
        responder(false, 'Filme inválido.', 422);
    }

    try {
        $pdo = conectar();
        $stmt = $pdo->prepare('SELECT capa FROM filmes WHERE id = ?');
        $stmt->execute([$id]);
        $filme = $stmt->fetch();
        if (!$filme) {
            responder(false, 'Filme não encontrado.', 404);
        }

        $pdo->prepare('DELETE FROM filmes WHERE id = ?')->execute([$id]);

        if ($filme['capa'] !== null) {
            @unlink(__DIR__ . '/../frontend/img/capas/' . $filme['capa']);
        }
    } catch (PDOException $e) {
        error_log($e->getMessage());
        responder(false, 'Não foi possível excluir o filme agora.', 500);
    }

    responder(true, 'Filme removido do catálogo.');
    