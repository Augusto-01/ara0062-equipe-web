<?php
declare(strict_types=1);
require __DIR__ . '/config/conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(false, 'Método não permitido.', 405);
}
exigirPostValido();

$titulo    = texto('titulo');
$descricao = texto('descricao');
$imdbId    = texto('imdb_id');     // vem da Cinemeta (ex.: tt0816692), opcional
$posterUrl = texto('poster_url');  // endereço do pôster na Cinemeta, opcional
$nota      = filter_var($_POST['nota'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 5]]);

if ($titulo === '' || mb_strlen($titulo) > 150) {
    responder(false, 'Informe o título do filme (até 150 caracteres).', 422);
}
if (mb_strlen($descricao) > 1000) {
    responder(false, 'A opinião pode ter até 1000 caracteres.', 422);
}
if ($nota === false || $nota === null) {
    responder(false, 'Escolha uma nota de 1 a 5 estrelas.', 422);
}

// Dados da Cinemeta: o navegador pode ser adulterado, então o servidor confere.
if ($imdbId !== '' && !preg_match('/^tt\d{5,12}$/', $imdbId)) {
    responder(false, 'Código IMDb inválido.', 422);
}
if ($posterUrl !== '') {
    $esquema = strtolower((string) parse_url($posterUrl, PHP_URL_SCHEME));
    if (
        mb_strlen($posterUrl) > 2048
        || !in_array($esquema, ['http', 'https'], true)
        || !filter_var($posterUrl, FILTER_VALIDATE_URL)
        || preg_match('/[\s"\'()<>\\\\]/', $posterUrl)
    ) {
        responder(false, 'Endereço do pôster inválido.', 422);
    }
}

// Upload opcional do pôster: valida tamanho e tipo real do arquivo.
$capa = null;
$arquivo = $_FILES['foto'] ?? null;
if ($arquivo && $arquivo['error'] !== UPLOAD_ERR_NO_FILE) {
    if ($arquivo['error'] !== UPLOAD_ERR_OK || $arquivo['size'] > 2 * 1024 * 1024) {
        responder(false, 'A imagem deve ter até 2 MB.', 422);
    }
    $extensoes = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($arquivo['tmp_name']);
    if (!isset($extensoes[$mime])) {
        responder(false, 'Envie uma imagem JPG, PNG ou WebP.', 422);
    }
    $pasta = __DIR__ . '/../frontend/img/capas/';
    if (!is_dir($pasta) && !mkdir($pasta, 0755, true)) {
        responder(false, 'Não foi possível preparar a pasta de imagens.', 500);
    }
    $capa = bin2hex(random_bytes(12)) . '.' . $extensoes[$mime];
    if (!move_uploaded_file($arquivo['tmp_name'], $pasta . $capa)) {
        responder(false, 'Não foi possível guardar a imagem.', 500);
    }
}

try {
    $stmt = conectar()->prepare(
        'INSERT INTO filmes (titulo, descricao, nota, capa, imdb_id, poster_url) VALUES (?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $titulo,
        $descricao === '' ? null : $descricao,
        $nota,
        $capa,
        $imdbId === '' ? null : $imdbId,
        $posterUrl === '' ? null : $posterUrl,
    ]);
} catch (PDOException $e) {
    error_log($e->getMessage());
    if ($capa !== null) {
        @unlink(__DIR__ . '/../frontend/img/capas/' . $capa);
    }
    responder(false, 'Não foi possível salvar o filme agora. Tente de novo em instantes.', 500);
}

responder(true, 'Filme salvo no seu catálogo.');