#!/bin/sh
set -eu
cd /tmp
IFS= read -r code64 || true
IFS= read -r input64 || true
mkdir -p /tmp/student /tmp/nuget
printf '%s' "$code64" | base64 -d > /tmp/student/Program.cs
cat > /tmp/student/NuGet.Config <<'EOF'
<?xml version="1.0" encoding="utf-8"?><configuration><packageSources><clear /></packageSources></configuration>
EOF
cat > /tmp/student/student.csproj <<'EOF'
<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net8.0</TargetFramework><ImplicitUsings>disable</ImplicitUsings><Nullable>disable</Nullable><RestoreIgnoreFailedSources>true</RestoreIgnoreFailedSources></PropertyGroup></Project>
EOF
if ! dotnet restore /tmp/student/student.csproj --configfile /tmp/student/NuGet.Config --ignore-failed-sources >/dev/null 2>&1; then echo 'تعذر تجهيز بيئة البناء.' >&2; exit 2; fi
if ! dotnet build /tmp/student/student.csproj --no-restore -o /tmp/output >&2; then exit 2; fi
echo '__NABTA_COMPILE_OK__'
printf '%s' "$input64" | base64 -d | timeout 5s dotnet /tmp/output/student.dll
