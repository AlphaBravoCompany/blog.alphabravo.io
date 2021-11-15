Create a directory to hold the audit logs: mkdir /var/lib/rancher/audit

Pull down a policy file and save it to the audit directory, save it as /var/lib/rancher/audit/audit  policy.yaml: https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/audit/audit-policy.yaml

Edit the service file for k3s: vim /etc/systemd/system/k3s.service

Update the ExecStart to use the following: ExecStart=/usr/local/bin/k3s server --kube-apiserver-arg=audit-log-path=/var/lib/rancher/audit/audit.log --kube-apiserver-arg=audit-policy-file=/var/lib/rancher/audit/audit-policy.yaml

Reload systemctl daemon: systemctl daemon-reload

Restart k3s: systemctl restart k3s

Tail the log: tail -f /var/lib/rancher/audit/audit.log