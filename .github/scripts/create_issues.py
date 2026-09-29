#!/usr/bin/env python3
"""Crée dans le dépôt GitHub les issues décrites dans .github/issues/*.md.

Chaque fichier commence par un en-tête :

    ---
    title: Titre de l'issue
    labels: bug, tests
    ---
    Texte de l'issue en markdown…

Les issues sont créées dans l'ordre alphabétique des fichiers (01-…, 02-…). Une issue dont le
titre existe déjà dans le dépôt (ouverte ou fermée) est ignorée : le script peut être relancé
sans créer de doublon.

Utilisé par le workflow « Créer les issues du projet » (.github/workflows/create-issues.yml).
En local, avec le CLI gh connecté : python3 .github/scripts/create_issues.py
Pour vérifier le contenu sans rien créer : DRY_RUN=1 python3 .github/scripts/create_issues.py
"""

import json
import os
import pathlib
import subprocess
import sys

ISSUES_DIR = pathlib.Path(__file__).resolve().parent.parent / "issues"
DRY_RUN = os.environ.get("DRY_RUN") == "1"
LABELS = {
    "bug": ("d73a4a", "Comportement incorrect du site"),
    "tests": ("0e8a16", "Tests automatisés à corriger ou à écrire"),
}


def parse_issue(path):
    text = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    if not text.startswith("---\n") or "\n---\n" not in text[4:]:
        raise ValueError(f"{path.name} : l'en-tête --- title / labels --- est manquant")
    header, body = text[4:].split("\n---\n", 1)
    meta = {}
    for line in header.splitlines():
        if line.strip():
            key, _, value = line.partition(":")
            meta[key.strip()] = value.strip().strip('"')
    if not meta.get("title"):
        raise ValueError(f"{path.name} : le titre est manquant")
    labels = [label.strip() for label in meta.get("labels", "").split(",") if label.strip()]
    return {"file": path.name, "title": meta["title"], "labels": labels, "body": body.strip() + "\n"}


def gh(*args, stdin=None):
    result = subprocess.run(["gh", *args], input=stdin, capture_output=True, text=True)
    if result.returncode != 0:
        sys.exit(f"Échec de « gh {' '.join(args[:2])} » : {result.stderr.strip()}")
    return result.stdout


def main():
    issues = [parse_issue(path) for path in sorted(ISSUES_DIR.glob("*.md"))]
    if not issues:
        sys.exit(f"Aucune issue trouvée dans {ISSUES_DIR}")

    if DRY_RUN:
        for issue in issues:
            print(f"[simulation] {issue['file']} → « {issue['title']} » {issue['labels']}")
        return

    existing = {
        issue["title"]
        for issue in json.loads(gh("issue", "list", "--state", "all", "--limit", "500", "--json", "title"))
    }

    for label in sorted({label for issue in issues for label in issue["labels"]}):
        color, description = LABELS.get(label, ("ededed", ""))
        gh("label", "create", label, "--color", color, "--description", description, "--force")

    created = 0
    for issue in issues:
        if issue["title"] in existing:
            print(f"Déjà présente, ignorée : {issue['title']}")
            continue
        label_args = [arg for label in issue["labels"] for arg in ("--label", label)]
        url = gh("issue", "create", "--title", issue["title"], "--body-file", "-", *label_args, stdin=issue["body"])
        print(f"Créée : {issue['title']} → {url.strip()}")
        created += 1
    print(f"{created} issue(s) créée(s), {len(issues) - created} déjà présente(s).")


if __name__ == "__main__":
    main()
